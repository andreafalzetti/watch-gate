const Consumer = require('sqs-consumer');
const Producer = require('sqs-producer');
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const errors = require('feathers-errors');

class SQSConsumer {
  /**
   * @constructor
   */
  constructor (options = { awsConfig: {}, queueUrl: '' }) {
    /*
     * Ref. to FeathersJS App
     */
    this.app = options.app;

    this.handleMessage = this.handleMessage.bind(this);
    this.approveWatchRequest = this.approveWatchRequest.bind(this);
    this.saveStream = this.saveStream.bind(this);

    /*
     * If awsConfig is not defined, the machine conf will be used (~/.awd)
     */
    if (typeof options.awsConfig === 'object') {
      AWS.config.update(options.awsConfig);
    }

    this.consumer = Consumer.create({
      queueUrl: options.queueUrl || '',
      handleMessage: this.handleMessage
    });
    
    this.producers = {};
    this.producers.approve = Producer.create({
      queueUrl: this.app.get('sqs_queues').approved_watch_requests,
      region: this.app.get('aws_region')
    });
    this.producers.reject = Producer.create({
      queueUrl: this.app.get('sqs_queues').rejected_watch_requests,
      region: this.app.get('aws_region')
    });

    /*
     * Error Handling
     */
    this.consumer.on('error', this.errorHandler);
  }

  /*
   * This is a fallback log function in case options.logger is not provided
   */
  log (message = '', data = {}) {
    console.log(message, data)
  }

  /*
   * Subscribes to the queue
   */
  start () {
    this.consumer.start();
    this.log('SQSConsumer started');
  }

  /*
   * Error Handler
   */
  errorHandler (error) {
    this.log('SQSConsumer', error)
  }

  saveStream (data) {
    return new Promise( (resolve, reject) => {
      const params = {
        provider: undefined
      };
      this.app.service('streams').create(data, params).then(result => {
        console.log('create streams', result);
        resolve();
      });
    });
  }

  approveWatchRequest (data) {
    const watchRequest = {
      id: uuidv4(),
      body: JSON.stringify(Object.assign({}, data, { status: 'approved' }))
    };
    return new Promise ((resolve, reject) => {
      this.producers.approve.send(watchRequest, error => {
        if (error) {
          const err = new errors.GeneralError('watch_request was not added to the queue', { error: error.message });
          reject(err);
        } else {
          console.log('Approved watch_request queued successfully')
          resolve();
        }
      });
    });
  }

  rejectWatchRequest (data) {
    const watchRequest = {
      id: uuidv4(),
      body: JSON.stringify(Object.assign({}, data, { status: 'rejected' }))
    };
    return new Promise ((resolve, reject) => {
      this.producers.reject.send(watchRequest, error => {
        if (error) {
          const err = new errors.GeneralError('watch_request was not added to the queue', { error: error.message });
          reject(err);
        } else {
          console.log('Rejected watch_request queued successfully')
          resolve();
        }
      });
    });
  }

  countStremsByUserId (user) {
    return new Promise( (resolve, reject) => {
      const params = {
        query: Object.assign({}, { user }),
        provider: undefined
      };
      this.app.service('streams').find(params).then( result => {
        resolve(result.total);
      });
    });
  }

  /*
   * Receive the new messages and removes messages from the queue
   */
  async handleMessage (message, done) {    
    const payload = JSON.parse(message.Body);    
    const userStreamsCount = await this.countStremsByUserId(payload.user);
    const body = JSON.parse(message.Body);
    if(userStreamsCount < 3) {
      await this.approveWatchRequest(body);
      await this.saveStream(payload);
      done();
    } else {
      await this.rejectWatchRequest(body);
      done();
    }
  }
}

module.exports = SQSConsumer;

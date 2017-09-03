const Consumer = require('sqs-consumer');
const Producer = require('sqs-producer');
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const errors = require('feathers-errors');

class SQSConsumer {
  /**
   * @constructor
   */
  constructor (options = { awsConfig: {}, queueUrl: '', messageAttributeNames: [], handlers: [] }) {
    /*
     * Ref. to FeathersJS App
     */
    this.app = options.app;

    this.handleMessage = this.handleMessage.bind(this);
    this.parseMessageAttributes = this.parseMessageAttributes.bind(this);
    this.getStringAttribute = this.getStringAttribute.bind(this);
    this.invokeHandler = this.invokeHandler.bind(this);
    this.approveWatchRequest = this.approveWatchRequest.bind(this);

    /*
     * If awsConfig is not defined, the machine conf will be used (~/.awd)
     */
    if (typeof options.awsConfig === 'object') {
      AWS.config.update(options.awsConfig);
    }

    /*
     * Handlers are injected from ../index.js
     */
    this.handlers = options.handlers || [];
    this.consumer = Consumer.create({
      queueUrl: options.queueUrl || '',
      messageAttributeNames: options.messageAttributeNames || [],
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
     * Application logger method
     */
    // this.log = this.log;

    /*
     * Error Handling
     */
    this.consumer.on('error', this.errorHandler);
    // this.errorHandler = this.errorHandler.bind(this);
    // this.log = this.log.bind(this);
  }

  /*
   * This is a fallback log function in case options.logger is not provided
   */
  log (message, data) {
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
    // this.log('SQSConsumer', error)
  }

  approveWatchRequest (data) {
    const watchRequest = {
      id: uuidv4(),
      body: JSON.stringify(data)
    };
    return new Promise ((resolve, reject) => {
      this.producers.approve.send(watchRequest, error => {
        if (error) {
          const err = new errors.GeneralError('watch_request was not added to the queue', { error: error.message });
          reject(err);
        } else {
          console.log("Watch request ququed successfully")
          resolve();
        }
      });
    });
  }

  /*
   * Receive the new messages and removes messages from the queue
   */
  handleMessage (message, done) {
    // console.log("banana", message);
    const payload = JSON.parse(message.Body);
    // console.log('payload', payload)
    return new Promise( (resolve, reject) => {
      const params = {
        query: Object.assign({}, { user: payload.user }),
        provider: undefined
      };
      this.app.service('streams').find(params).then(result => {
        // console.log('=====>', result);
        resolve();
        if(result.total < 3) {
          console.log(`watch-request approved, user ${payload.user} is watching ${result.total} streams`);
          this.approveWatchRequest(message.Body);
          done()
        //   // hook.params.availableVideos = result;
        //   resolve(hook);
        } else {
        //   // const data = new errors.NotFound('There is no content available with this filter', { query: params.query});
        //   reject(data);
        }
      });
    });
    // const atts = this.parseMessageAttributes(message);
    // this.invokeHandler(message.Body, atts);
    // done();
  }
  

  /*
   * Check and parse the message attributes
   */
  parseMessageAttributes (message) {
    console.log('parseMessageAttributes');
    let atts = {};
    if (typeof message.MessageAttributes === 'object') {
      console.log("Attributes found");
      atts.usersIds = this.getStringAttribute(message.MessageAttributes, 'userIds', { isArray: true });
      atts.notificationType = this.getStringAttribute(message.MessageAttributes, 'notificationType');
    } else {
      console.log("No attributes found", typeof message.MessageAttributes);
    }
    return atts;
  }

  /*
   * Given the list of attributes, it returns the value of a single attribute
   */
  getStringAttribute (atts, key, options = { isArray: false }) {
    console.log('getStringAttribute');
    let value = options.isArray ? [] : '';
    if (typeof atts[key] === 'object' && typeof atts[key].StringValue === 'string') {
      value = atts[key].StringValue;
      if (options.isArray) {
        value = value.split(',');
        value = value.map(item => item.replace(/\s/g, ''));
      }
    }
    return value;
  }

  /*
   * Invokes the correct handler for each specific notification
   */
  invokeHandler (body, atts) {
    console.log('Watch Request', body)
    // const { notificationType } = atts;
    // console.log('request', notificationType);
    // if (typeof this.handlers[notificationType] === 'function') {
    //   const handlerFunc = this.handlers[notificationType];
    //   handlerFunc()
    //   .then( response => {
    //     this.log(`SQSConsumer Handler ran successfully (${notificationType})`)
    //   })
    //   .catch( error => {
    //     this.log(`SQSConsumer Handler error occurred (${notificationType})`, error)
    //   })
    // } else {
    //   this.log(`SQSConsumer Handler not found (${notificationType})`, typeof this.handlers[notificationType])
    // }
  }

}

module.exports = SQSConsumer;

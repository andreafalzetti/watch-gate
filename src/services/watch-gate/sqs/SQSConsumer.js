const Consumer = require('sqs-consumer');
const AWS = require('aws-sdk');

class SQSConsumer {
  /**
   * @constructor
   */
  constructor (options = { awsConfig, queueUrl: '', messageAttributeNames: [], handlers: [] }) {

    this.handleMessage = this.handleMessage.bind(this);
    this.parseMessageAttributes = this.parseMessageAttributes.bind(this);
    this.getStringAttribute = this.getStringAttribute.bind(this);
    this.invokeHandler = this.invokeHandler.bind(this);

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

    /*
     * Application logger method
     */
    this.logger = options.logger || this.log;

    /*
     * Error Handling
     */
    this.consumer.on('error', this.errorHandler);
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
    this.logger.info('SQSConsumer started');
  }

  /*
   * Error Handler
   */
  errorHandler (error) {
    this.logger.error('SQSConsumer', error)
  }

  /*
   * Receive the new messages and removes messages from the queue
   */
  handleMessage (message, done) {
    console.log("banana", message);
    const atts = this.parseMessageAttributes(message);
    this.invokeHandler(message.Body, atts);
    done();
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
    const { notificationType } = atts;
    console.log('notificationType', notificationType);
    if (typeof this.handlers[notificationType] === 'function') {
      const handlerFunc = this.handlers[notificationType];
      handlerFunc()
      .then( response => {
        this.logger.info(`SQSConsumer Handler ran successfully (${notificationType})`)
      })
      .catch( error => {
        this.logger.error(`SQSConsumer Handler error occurred (${notificationType})`, error)
      })
    } else {
      this.logger.error(`SQSConsumer Handler not found (${notificationType})`, typeof this.handlers[notificationType])
    }
  }

}

module.exports = SQSConsumer;

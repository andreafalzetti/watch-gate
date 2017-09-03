const SQSConsumer = require('./SQSConsumer')

/**
 * Pre-loads all handlers
 */
const SQSHandlers = require('require-all')(__dirname + '/handlers');

const createSQSConsumer = (options) => {
  options.handlers = SQSHandlers;
  const consumer = new SQSConsumer(options);
  return consumer;
}

module.exports.createSQSConsumer = createSQSConsumer

const SQSConsumer = require('./SQSConsumer');

const createSQSConsumer = (options) => {
  const consumer = new SQSConsumer(options);
  return consumer;
};

module.exports.createSQSConsumer = createSQSConsumer;

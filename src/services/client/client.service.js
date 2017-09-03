// Initializes the `client` service on path `/client`
const createService = require('./client.class.js');
const hooks = require('./client.hooks');
const filters = require('./client.filters');
const SQSConsumer = require('./sqs');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'client',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/client', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('client');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }

  // approved
  const sqsServiceApproved = SQSConsumer.createSQSConsumer({
    awsConfig: {
      region: app.get('aws_region'),
      accessKeyId: app.get('aws_access_key_id'),
      secretAccessKey: app.get('aws_secret_access_key'),
    },
    queueUrl: app.get('sqs_queues').approved_watch_requests,
    messageAttributeNames: [],
    app
  });
  sqsServiceApproved.start();

  // rejected
  const sqsServiceRejected = SQSConsumer.createSQSConsumer({
    awsConfig: {
      region: app.get('aws_region'),
      accessKeyId: app.get('aws_access_key_id'),
      secretAccessKey: app.get('aws_secret_access_key'),
    },
    queueUrl: app.get('sqs_queues').rejected_watch_requests,
    messageAttributeNames: [],
    app
  });
  sqsServiceRejected.start();
};

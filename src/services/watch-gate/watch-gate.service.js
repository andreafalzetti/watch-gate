// Initializes the `watch-gate` service on path `/watch-gate`
const createService = require('./watch-gate.class.js');
const hooks = require('./watch-gate.hooks');
const filters = require('./watch-gate.filters');
const SQSConsumer = require('./sqs');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'watch-gate',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/watch-gate', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('watch-gate');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }

  const sqsService = SQSConsumer.createSQSConsumer({
    awsConfig: {
      region: app.get('aws_region'),
      accessKeyId: app.get('aws_access_key_id'),
      secretAccessKey: app.get('aws_secret_access_key'),
    },
    queueUrl: app.get('sqs_queues').watch_request,
    messageAttributeNames: [],
    app
  });
  sqsService.start();

};

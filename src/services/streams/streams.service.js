// Initializes the `streams` service on path `/streams`
const createService = require('feathers-mongoose');
const createModel = require('../../models/streams.model');
const hooks = require('./streams.hooks');
const filters = require('./streams.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'streams',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/streams', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('streams');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};

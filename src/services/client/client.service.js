// Initializes the `client` service on path `/client`
const createService = require('./client.class.js');
const hooks = require('./client.hooks');
const filters = require('./client.filters');

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
};

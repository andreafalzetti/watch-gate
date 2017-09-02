// Initializes the `catalog` service on path `/catalog`
const createService = require('./catalog.class.js');
const hooks = require('./catalog.hooks');
const filters = require('./catalog.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'catalog',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/catalog', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('catalog');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};

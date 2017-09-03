// Initializes the `watch-gate` service on path `/watch-gate`
const createService = require('./watch-gate.class.js');
const hooks = require('./watch-gate.hooks');
const filters = require('./watch-gate.filters');

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
};

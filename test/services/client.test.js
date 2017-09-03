const assert = require('assert');
const app = require('../../src/app');

describe('\'client\' service', () => {
  it('registered the service', () => {
    const service = app.service('client');

    assert.ok(service, 'Registered the service');
  });
});

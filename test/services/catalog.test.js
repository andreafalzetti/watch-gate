const assert = require('assert');
const app = require('../../src/app');

describe('\'catalog\' service', () => {
  it('registered the service', () => {
    const service = app.service('catalog');

    assert.ok(service, 'Registered the service');
  });
});

const assert = require('assert');
const app = require('../../src/app');

describe('\'watch-gate\' service', () => {
  it('registered the service', () => {
    const service = app.service('watch-gate');

    assert.ok(service, 'Registered the service');
  });
});

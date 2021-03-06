const users = require('./users/users.service.js');
const streams = require('./streams/streams.service.js');
const videos = require('./videos/videos.service.js');
const catalog = require('./catalog/catalog.service.js');
const watchGate = require('./watch-gate/watch-gate.service.js');
const client = require('./client/client.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(streams);
  app.configure(videos);
  app.configure(catalog);
  app.configure(watchGate);
  app.configure(client);
};

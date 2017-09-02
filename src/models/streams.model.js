const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// videos-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const streams = new mongooseClient.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    video: { type: Schema.Types.ObjectId, ref: 'videos', required: true },
    lastMinuteWatch: { type: Number, min: 0, max: 360 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('streams', streams);
};

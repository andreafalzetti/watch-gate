// videos-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const videos = new mongooseClient.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    secondsDuration: {
      type: Number,
      min: [ 1, 'The content must be at least 1 second long' ],
      max: [ 21600, 'The content cannot be at longer than 6 hours' ],
    },
    status: {
      type: String,
      default: 'published',
      enum: ['published', 'unpublished']
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('videos', videos);
};

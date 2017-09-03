const errors = require('feathers-errors');
const Producer = require('sqs-producer');

/**
 * Hook which initialise the AWS Producer. This singleton class allows to push
 * new items to the SQS queue.
 */
const initProducer = () => hook => {
  hook.params.producer = Producer.create({
    queueUrl: hook.app.get('sqs_queues').watch_request,
    region: hook.app.get('aws_region')
  });
  return Promise.resolve(hook);
};

// const addRequestToQueue = () => hook => {
//   return new Promise( (resolve, reject) => {
//     hook.params.producer.send(req.profiler.sqsProducer, function(err) {
//       if (err) console.log(err);
//     });
//   }
// };

/**
 * Hook which fetches the available content so that it can be returned to the client
 */
const getAvailableVideos = () => hook => {
  return new Promise( (resolve, reject) => {
    const params = Object.assign({}, hook.params, {
      // query: Object.assign({}, hook.params.query),
      provider: undefined
    });
    hook.app.service('videos').find(params).then(result => {
      if(result.total > 0) {
        hook.params.availableVideos = result;
        resolve(hook);
      } else {
        const data = new errors.NotFound('There is no content available with this filter', { query: params.query});
        reject(data);
      }
    });
  });
};


module.exports = {
  before: {
    all: [],
    find: [
      getAvailableVideos()
    ],
    get: [],
    create: [
      initProducer()
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: { 
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

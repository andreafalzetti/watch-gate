const errors = require('feathers-errors');
const uuidv4 = require('uuid/v4');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    const { availableVideos } = params;
    let result = {
      message: 'OK',
      data: {
        availableVideos
      }
    };
    return Promise.resolve(result);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    let result = {
      message: 'OK',
      data
    };
    const watchRequest = {
      id: uuidv4(),
      body: JSON.stringify(data)
    };
    return new Promise ((resolve, reject) => {
      params.producer.send(watchRequest, error => {
        if (error) {
          const err = new errors.GeneralError('watch_request was not added to the queue', { error: error.message });
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    console.log('params ==>', params)
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
    // if (Array.isArray(data)) {
    //   return Promise.all(data.map(current => this.create(current)));
    // }

    console.log('watch request', data, params)
    // params.producer.send(req.profiler.sqsProducer, function(err) {
    //   if (err) console.log(err);
    // });

    return Promise.resolve(data);
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

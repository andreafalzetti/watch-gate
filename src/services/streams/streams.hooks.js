const { populate } = require('feathers-hooks-common');

const streamsVideosSchema = {
  include: {
    service: 'videos',
    nameAs: 'videos',
    parentField: 'video',
    childField: '_id',
    useInnerPopulate: true,
    provider: undefined
  }
};


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      populate({ schema: streamsVideosSchema })
    ],
    get: [
      populate({ schema: streamsVideosSchema })
    ],
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

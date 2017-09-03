const { populate } = require('feathers-hooks-common');

const usersStreamsSchema = {
  include: {
    service: 'streams',
    nameAs: 'streams',
    parentField: '_id',
    childField: 'user',
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
      populate({ schema: usersStreamsSchema })
    ],
    get: [
      populate({ schema: usersStreamsSchema })
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

'use strict';

const { camelize } = require('underscore.string');

const { mapKeys } = require('../../../utilities');

// Change arguments cases
const renameArgs = function ({ args }) {
  return mapKeys(args, (arg, name) => camelize(name));
};

module.exports = {
  renameArgs,
};

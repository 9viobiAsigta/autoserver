'use strict';

const { sortArray } = require('../../../../../utilities');
const { findIndexes } = require('../indexes');

const deleteMany = function ({ collection, filter }) {
  const indexes = findIndexes({ collection, filter });
  const sortedIndexes = sortArray(indexes);
  const data = sortedIndexes
    // eslint-disable-next-line fp/no-mutating-methods
    .map((index, count) => collection.splice(index - count, 1)[0]);
  return { data };
};

module.exports = {
  delete: deleteMany,
};
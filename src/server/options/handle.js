'use strict';

const { monitoredReduce } = require('../../perf');

const { applyDefaultOptions } = require('./default');
const { validateOptions } = require('./validate');

const processors = [
  applyDefaultOptions,
  validateOptions,
];

const handleOptions = function ({ oServerOpts }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { serverOpts: oServerOpts },
    category: 'options',
    mapInput: ({ serverOpts }) => serverOpts,
    mapResponse: serverOpts => ({ serverOpts }),
  });
};

module.exports = {
  handleOptions,
};

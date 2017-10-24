'use strict';

const { monitoredReduce } = require('../perf');
const { compileSchemaFuncs, getUserVars } = require('../schema_func');
const {
  loadSchema,
  compileJsonSchema,
  operationsStartServer,
} = require('../schema');

// Parse schema
const parseSchema = function ({ runOpts, measures }) {
  return monitoredReduce({
    funcs: processors,
    initialInput: { runOpts, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'schema',
  });
};

const processors = [
  loadSchema,
  compileSchemaFuncs,
  getUserVars,
  compileJsonSchema,
  operationsStartServer,
];

module.exports = {
  parseSchema,
};

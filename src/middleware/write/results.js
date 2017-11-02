'use strict';

const { assignArray } = require('../../utilities');
const { throwError } = require('../../error');

const { handlers } = require('./args');

// Transform results to normalized format
const getResults = function ({ actions, results, ids, modelName, top }) {
  validateResults({ ids, results });

  return actions
    .map(action => setModels({ action, results, modelName, top }))
    .reduce(assignArray, []);
};

// `results` should be in same order as `args.data` or
// (for `delete`) as `currentData`, and reuse their `dataPaths`
const setModels = function ({
  results,
  modelName,
  action,
  action: { dataPaths, select },
  top: { command },
}) {
  const { getModels } = handlers[command.type];
  const models = getModels(action);
  return models
    .map(findModel.bind(null, { results, dataPaths, select, modelName }))
    .filter(({ path }) => path !== undefined);
};

const findModel = function (
  { results, dataPaths, select, modelName },
  { id },
  index,
) {
  const model = results.find(result => result.id === id);
  const path = dataPaths[index];
  return { path, model, modelName, select };
};

// Safety check to make sure there is no server-side bugs
const validateResults = function ({ ids, results }) {
  const sameLength = results.length === ids.length;
  if (sameLength) { return; }

  const message = `'ids' and 'results' do not have the same length`;
  throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
};

module.exports = {
  getResults,
};

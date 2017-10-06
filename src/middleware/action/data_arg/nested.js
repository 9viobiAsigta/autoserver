'use strict';

const { uniq } = require('lodash');

const { assignArray } = require('../../../utilities');
const { getModel } = require('../get_model');

const { getDataPath } = require('./data_path');
const { isObject } = require('./validate');

// Retrieve the keys of an `args.data` object which are nested models
const getNestedKeys = function ({ data, commandPath, top, modelsMap }) {
  const nestedKeys = data
    .map(Object.keys)
    .reduce(assignArray, []);
  const nestedKeysA = uniq(nestedKeys);
  // Keep only the keys which are nested models
  const nestedKeysB = nestedKeysA
    .filter(attrName => isModel({ attrName, commandPath, top, modelsMap }));
  return nestedKeysB;
};

const isModel = function ({ attrName, commandPath, top, modelsMap }) {
  const commandPathA = [...commandPath, attrName];
  const model = getModel({ top, modelsMap, commandPath: commandPathA });
  return model !== undefined && model.modelName !== undefined;
};

// Retrieve children actions of an `args.data` object by iterating over them
const getNestedActions = function ({ nestedKeys, ...rest }) {
  return nestedKeys
    .map(nestedKey => getNestedAction({ ...rest, nestedKey }))
    .reduce(assignArray, []);
};

const getNestedAction = function ({
  data,
  dataPaths,
  commandPath,
  top,
  modelsMap,
  nestedKey,
  parseActions,
}) {
  const nestedCommandPath = [...commandPath, nestedKey];
  const nestedData = getData({ data, nestedKey });
  const nestedDataPaths = getDataPaths({ dataPaths, data, nestedKey });

  return parseActions({
    commandPath: nestedCommandPath,
    data: nestedData,
    dataPaths: nestedDataPaths,
    top,
    modelsMap,
  });
};

// Retrieve nested data
const getData = function ({ data, nestedKey }) {
  return data
    .map(datum => datum[nestedKey])
    .reduce(assignArray, [])
    .filter(isObject);
};

// Add the `dataPaths` to the nested data, by adding `nestedKey` to each parent
// `dataPaths`
const getDataPaths = function ({ dataPaths, data, nestedKey }) {
  return dataPaths
    .map((dataPath, index) => getDataPath({
      data: data[index][nestedKey],
      path: [...dataPath, nestedKey],
    }))
    .reduce(assignArray, []);
};

module.exports = {
  isModel,
  getNestedKeys,
  getNestedActions,
};
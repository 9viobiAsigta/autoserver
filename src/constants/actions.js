'use strict';

const { throwError } = require('../error');

const ACTIONS = [
  { name: 'findOne', type: 'find', multiple: false, command: 'read' },
  { name: 'findMany', type: 'find', multiple: true, command: 'read' },
  { name: 'createOne', type: 'create', multiple: false, command: 'create' },
  { name: 'createMany', type: 'create', multiple: true, command: 'create' },
  { name: 'replaceOne', type: 'replace', multiple: false, command: 'update' },
  { name: 'replaceMany', type: 'replace', multiple: true, command: 'update' },
  { name: 'updateOne', type: 'update', multiple: false, command: 'update' },
  { name: 'updateMany', type: 'update', multiple: true, command: 'update' },
  { name: 'upsertOne', type: 'upsert', multiple: false, command: 'upsert' },
  { name: 'upsertMany', type: 'upsert', multiple: true, command: 'upsert' },
  { name: 'deleteOne', type: 'delete', multiple: false, command: 'delete' },
  { name: 'deleteMany', type: 'delete', multiple: true, command: 'delete' },
];

const getActionConstant = function ({ actionType, isArray }) {
  const actionConstant = ACTIONS
    .find(({ multiple, type }) => multiple === isArray && type === actionType);

  if (!actionConstant) {
    const message = `Action '${actionType}' is unknown`;
    throwError(message, { reason: 'INPUT_VALIDATION' });
  }

  return actionConstant;
};

module.exports = {
  ACTIONS,
  getActionConstant,
};
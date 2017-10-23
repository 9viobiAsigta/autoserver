'use strict';

const { GraphQLNonNull, GraphQLString } = require('graphql');

const { ARG_TYPES_DESCRIPTIONS } = require('../../../../description');

// `id` argument
const getIdArgument = function (def) {
  const hasId = !def.command.multiple &&
    ID_COMMAND_TYPES.includes(def.command.type);
  if (!hasId) { return {}; }

  const description = ARG_TYPES_DESCRIPTIONS.filter[def.command.name];

  const args = getIdArgs({ description });
  return args;
};

const ID_COMMAND_TYPES = ['find', 'delete', 'patch'];

const getIdArgs = ({ description }) => ({
  id: {
    type: new GraphQLNonNull(GraphQLString),
    description,
  },
});

module.exports = {
  getIdArgument,
};
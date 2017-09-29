'use strict';

const { GraphQLString } = require('graphql');

// GraphQL requires every object field to have attributes,
// which does not always makes sense for us.
// So we add this patch this problem by adding this fake attribute
// when the problem arises.
const addNoAttributes = function ({ fields }) {
  if (Object.keys(fields).length > 0) { return fields; }

  return noAttributes;
};

const noAttributes = {
  no_attributes: {
    type: GraphQLString,
    description: `This type does not have any attributes.
This is a dummy attribute.`,
  },
};

module.exports = {
  addNoAttributes,
};
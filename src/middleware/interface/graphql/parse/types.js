'use strict';


const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');
const { mapValues, defaults } = require('lodash');

const { EngineError } = require('../../../../error');
const { getTypeName } = require('./name');
const { getModelsByMethod, findOperations } = require('./models');
const { getDescription, getDeprecationReason } = require('./description');


// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts) {
  return getField(def, opts).type;
};

// Retrieves a GraphQL field info for a given IDL definition, i.e. an object that can be passed to new GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  // Add field description|deprecation_reason, taken from IDL definition
  const description = getDescription({ def, prefix: opts.operation, multiple: def.items !== undefined });
  const deprecationReason = getDeprecationReason({ def });

  // Done so that children can get a cached reference of parent type, while avoiding infinite recursion
  // Only cache schemas that have a model name, because they are the only one that can recurse
  // Namespace by operation, because operations can have slightly different types
  const modelName = def.model;
  const key = modelName && `field/${modelName}/${opts.operation}`;
  if (key && opts.cache.exists(key)) {
    const cachedDef = opts.cache.get(key);
    // Sub-models can override top-level models descriptions
    return defaults({}, cachedDef, { description, deprecationReason });
  }

  // Retrieves correct field
  const fieldInfo = graphQLFieldsInfo.find(possibleType => possibleType.condition(def, opts));
  if (!fieldInfo) {
    throw new EngineError(`Could not parse property into a GraphQL type: ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  // Retrieves field information
  const field = fieldInfo.value(def, opts);
  // The field description|deprecationReason is type-agnostic, so is not inside `fieldInfo.value()`
  Object.assign(field, { description, deprecationReason });

  if (key) {
    opts.cache.set(key, field);
  }
  return field;
};

/**
 * Maps an IDL definition into a GraphQL field information, including type
 * The first matching one will be used, i.e. order matters: required modifier, then array modifier come first
 */
const graphQLFieldsInfo = [

  {
    condition: def => def.required,
    value(def, opts) {
      // Goal is to avoid infinite recursion, i.e. without modification the same graphQLFieldsInfo would be hit again
      const modifiedDef = Object.assign({}, def, { required: false });
      const subType = getType(modifiedDef, opts);
      const type = new GraphQLNonNull(subType);
      return { type };
    },
  },

  {
    condition: def => def.type === 'array' && typeof def.items === 'object',
    value(def, opts) {
      const subDef = def.items;
      const subType = getType(subDef, opts);
      const type = new GraphQLList(subType);
      const fieldInfo = { type };

      // If this is a top-level model, assign resolver
      if (subDef.model) {
        Object.assign(fieldInfo, {
          args: {
            id: {
              type: GraphQLInt,
              //description: 'id to look at',
              defaultValue: 10
            },
          },
          async resolve(_, args, { callback }) {
            const operation = findOperations({ prefix: opts.operation, multiple: true });
            return await executeOperation({ operation, args, callback });
          },
        });
      }

      return fieldInfo;
    },
  },

  // Top-level method, e.g. 'Query' or 'Mutation'
  {
    condition: (_, { isMethod }) => isMethod,
    value(def, opts) {
      // Do this only at top-level
      opts.isMethod = false;

      // Retrieve the top-level operations
      const methodModels = getModelsByMethod(opts.methodName, opts);

      const fields = methodModels.reduce((fields, model) => {
        // Pass current operation down to sub-fields
        const operation = model.operation;
        // Keep models as options, so that sub-models can point to them, but only for current operation
        const operationsModels = methodModels.filter(methodModel => methodModel.operation === operation);
        opts = Object.assign({}, opts, { operation, operationsModels });

        fields[model.operationName] = getField(model, opts);
        return fields;
      }, {});

      const name = getTypeName(def);
      const description = getDescription({ def, prefix: opts.operation });

      const type = new GraphQLObjectType({
        name,
        description,
        fields,
      });

      const fieldInfo = { type };
      return fieldInfo;
    }
  },

  {
    condition: def => def.type === 'object',
    value(def, opts) {
      // If this definition points to a top-level model, use that model instead
      const operationsModels = opts.operationsModels;
      if (def.model && operationsModels) {
        def = operationsModels.find(operationsModel => operationsModel.model === def.model) || def;
      }

      const name = getTypeName(def, opts.operation);
      const description = getDescription({ def, prefix: opts.operation });

      const type = new GraphQLObjectType({
        name,
        description,

        // This needs to be function, otherwise we run in an infinite recursion,
        // if the children try to reference a parent type
        fields() {
          // Recurse over children
          return mapValues(def.properties, childDef => getField(childDef, opts));
        },
      });

      let fieldInfo = { type };

      // If this is a top-level model, assign resolver
      if (def.model) {
        Object.assign(fieldInfo, {
          async resolve(_, args, { callback }) {
            const operation = findOperations({ prefix: opts.operation, multiple: false });
            return await executeOperation({ operation, args, callback });
          },
        });
      }

      return fieldInfo;
    },
  },

  {
    condition: def => def.type === 'integer' && def.format === 'id',
    value: () => ({ type: GraphQLID }),
  },

  {
    condition: def => def.type === 'integer',
    value: () => ({ type: GraphQLInt }),
  },

  {
    condition: def => def.type === 'number',
    value: () => ({ type: GraphQLFloat }),
  },

  {
    condition: def => def.type === 'string',
    value: () => ({ type: GraphQLString }),
  },

  {
    condition: def => def.type === 'boolean',
    value: () => ({ type: GraphQLBoolean }),
  },

];

const executeOperation = async function ({ operation, args = {}, callback }) {
  const response = await callback({ operation, args });
  return response;
};


module.exports = {
  getType,
};

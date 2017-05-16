'use strict';


// List of defaults:
//  - key is argument attribute name
//  - dbFullActions are whitelisted
//  - value is the default value.
//    Can be a function taking the server options as first argument
const defaults = {
  args: {
    filter: {
      dbFullActions: ['findMany', 'deleteMany'],
      value: '(true)',
    },

    order_by: {
      dbFullActions: ['findMany', 'deleteMany', 'updateMany', 'createMany'],
      value: 'id+',
    },

    dry_run: {
      dbFullActions: [
        'deleteOne',
        'deleteMany',
        'updateOne',
        'updateMany',
        'createOne',
        'createMany',
      ],
      value: false,
    },

    no_output: {
      dbFullActions: [
        'deleteOne',
        'deleteMany',
        'updateOne',
        'updateMany',
        'createOne',
        'createMany',
      ],
      value: false,
    },

    page_size: {
      dbFullActions: ['findMany', 'deleteMany', 'updateMany', 'createMany'],
      value: ({ opts: { defaultPageSize } }) => defaultPageSize,
      // Only if pagination is enabled
      test: ({
        opts: { defaultPageSize },
        input: { sysArgs: { maxPageSize } },
      }) =>
        defaultPageSize !== 0 && maxPageSize !== 0,
    },

    after: {
      dbFullActions: ['findMany'],
      value: '',
      // Only if pagination is enabled, and arg.before|page is not specified
      test: ({
        opts: { defaultPageSize },
        input: { args: { before, page }, sysArgs: { maxPageSize } },
      }) => defaultPageSize !== 0 &&
        maxPageSize !== 0 &&
        before === undefined &&
        page === undefined
    },
  },
};


module.exports = {
  defaults,
};

export const COMMANDS = {
  findOne: {
    optional: ['populate', 'select', 'rename', 'silent', 'params'],
    required: ['id'],
  },
  findMany: {
    optional: [
      'populate',
      'filter',
      'order',
      'pagesize',
      'page',
      'before',
      'after',
      'select',
      'rename',
      'silent',
      'params',
    ],
    required: [],
  },
  deleteOne: {
    optional: ['cascade', 'select', 'rename', 'silent', 'dryrun', 'params'],
    required: ['id'],
  },
  deleteMany: {
    optional: [
      'cascade',
      'filter',
      'select',
      'rename',
      'silent',
      'dryrun',
      'params',
    ],
    required: [],
  },
  patchOne: {
    optional: ['select', 'rename', 'silent', 'dryrun', 'params'],
    required: ['id', 'data'],
  },
  patchMany: {
    optional: [
      'filter',
      'pagesize',
      'after',
      'select',
      'rename',
      'silent',
      'dryrun',
      'params',
    ],
    required: ['data'],
  },
  createOne: {
    optional: ['select', 'rename', 'silent', 'dryrun', 'params'],
    required: ['data'],
  },
  createMany: {
    optional: ['select', 'rename', 'silent', 'dryrun', 'params'],
    required: ['data'],
  },
  upsertOne: {
    optional: ['select', 'rename', 'silent', 'dryrun', 'params'],
    required: ['data'],
  },
  upsertMany: {
    optional: ['select', 'rename', 'silent', 'dryrun', 'params'],
    required: ['data'],
  },
}

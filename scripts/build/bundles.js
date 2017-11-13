const { join } = require('path');

const bundles = [
  {
    name: 'frost-builder',
    entry: join(__dirname, '..', 'packages/frost-builder'),
    builds: ['cli', 'es', 'cjs'],
    alias: ['frost-shared', 'frost-utils'],
  },

  {
    name: 'frost-shared',
    entry: join(__dirname, '..', 'packages/frost-shared'),
    builds: ['es', 'cjs'],
  },

  {
    name: 'frost-utils',
    entry: join(__dirname, '..', 'packages/frost-utils'),
    builds: ['es', 'cjs'],
  },
];

module.exports = bundles;

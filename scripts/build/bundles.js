const { join } = require('path');

const packageDir = join(__dirname, '../../packages/');

const bundles = [
  {
    name: 'frost-builder',
    path: join(packageDir, 'frost-builder'),
    builds: ['cli', 'cjs', 'es'],
  },

  {
    name: 'frost-express',
    path: join(packageDir, 'frost-express'),
    builds: ['cjs', 'es'],
  },

  /* {
    name: 'frost-react-core',
    path: join(packageDir, 'frost-react-core'),
    builds: ['cjs', 'es'],
  }, */

  {
    name: 'frost-shared',
    path: join(packageDir, 'frost-shared'),
    builds: ['cjs', 'es']
  },

  {
    name: 'frost-utils',
    path: join(packageDir, 'frost-utils'),
    builds: ['cjs', 'es'],
  },
];

module.exports = bundles;

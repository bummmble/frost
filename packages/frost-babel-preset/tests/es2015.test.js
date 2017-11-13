const buildPreset = require('../dist/index');
const { fixtures, titles, check } = require('./helpers');

const options = buildPreset(null, {
  modules: false,
  target: 'es2015',
  sourceMaps: false,
});

fixtures.forEach((filename, index) => {
  test(titles[index], () => check(filename, options));
});
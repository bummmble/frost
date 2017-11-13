const buildPreset = require('../dist/index');
const { fixtures, titles, check } = require('./helpers');

const options = buildPreset(null, {
  modules: false,
  sourceMaps: false,
  compression: true,
  env: 'production',
});

fixtures.forEach((filename, index) => {
  test(titles[index], () => check(filename, options));
});

const buildPreset = require('../dist/index');
const { fixtures, titles, check } = require('./helpers');

const options = buildPreset(null, {
  modules: false,
  target: { browsers: 'ie 11', node: '8.0.0' },
  imports: 'webpack',
  sourceMaps: false,
});

fixtures.forEach((filename, index) => {
  test(titles[index], () => check(filename, options));
});

const buildPreset = require('../dist/index.js');
const { fixtures, titles, check } = require('./helpers');

const options = buildPreset(null, { target: 'binary', sourceMaps: false, env: 'production' });

fixtures.forEach((filename, index) => {
    test(titles[index], () => check(filename, options));
});

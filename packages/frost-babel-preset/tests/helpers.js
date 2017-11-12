const { transformFile } = require('babel-core');
const { readdirSync } = require('fs');

const fixturesDir = './tests/fixtures/';

function check(fixture, options) {
    options.minified = false;
    options.compact = false;
    options.babelrc = false;
    return new Promise((resolve, reject) => {
        transformFile(`${fixturesDir}${fixture}`, options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                expect(result.code).toMatchSnapshot();
                resolve();
            }
        });
    });
}

const fixtures = readdirSync(fixturesDir);

function getTitle(name) {
    return name.replace(/\.js$/, '').replace(/_/, ': ').replace(/-/, ' ');
}

const titles = fixtures.map(getTitle);

module.exports = {
    check,
    fixtures,
    titles
};

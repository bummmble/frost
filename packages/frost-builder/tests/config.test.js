const test = require('ava');
const { loadConfig, validateConfig, processEntry } = require('../dist/index.cjs');

const testConfig = {
    entry: {
        client: 'client/index.js',
        server: 'server/index.js'
    }
};

const Schema = {
    entry: {
        client: {
            type: 'path',
            defaults: 'client/index.js'
        },

        server: {
            type: 'path',
            defaults: 'server/index.js'
        }
    }
};

test('It should validate a config object', t => {
    const config = validateConfig(testConfig, Schema);
    t.true(config.entry.client == testConfig.entry.client);
});

test('It should throw a type error for invalid configs', t => {
    const newConfig = Object.assign({
        mode: false
    }, testConfig);
    try {
        validateConfig(newConfig, Schema);
    } catch (err) {
        t.is(err.message , `Invalid type found for mode in config. Frost expected to receive string but instead received ${typeof newConfig.mode}`)
    }
});

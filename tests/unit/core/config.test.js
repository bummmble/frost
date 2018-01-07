import test from 'ava';
import { BaseTypes, MixedTypes } from '../../helpers/configTypes';
import { loadConfig, configError, processConfigEntry, validateConfig } from '../../../src/core/config';
import Schema from '../../../src/core/schema';

test('It should load a valid config', async t => {
    const config = await loadConfig('frost', {});
    t.true(typeof config === 'object');
    t.true(config.output.publicPath == '/static/');
});

test('Should append default values to empty config entries', t => {
    const config = {
        output: {}
    };
    const results = validateConfig(config, Schema);
    t.true(results.output.publicPath == '/static/');
});

test('Should apply flags to config', async t => {
    const config = await loadConfig('frost', {
        verbose: true
    });
    t.true(config.verbose === true);
});


// ---------- Base Types -----------

test('Should return correct config values for base types', t => {
    Object.keys(BaseTypes).forEach(base => {
        const value = BaseTypes[base].success;
        const type = { type: base };
        const key = 'test';
        const parsed = processConfigEntry(key, value, type);
        t.true(parsed === value);
    });
});

test('Should throw errors for incorrect base types in config', t => {
    Object.keys(BaseTypes).forEach(base => {
        const value = BaseTypes[base].failure;
        const type = { type: base };
        const key ='test';
        const msg = configError({ key, value, type: base });

        try {
            const parsed = processConfigEntry(key, value, type)
        } catch (err) {
            t.is(err.message, msg);
        }
    });
});


// ------------ Mixed Types --------------

test('Should return correct config values for mixed types', t => {
    Object.keys(MixedTypes).forEach(mixed => {
        const value = MixedTypes[mixed].success;
        const type = { type: mixed };
        const key = 'test';
        const parsed = processConfigEntry(key, value, type);
        t.true(parsed === value);
    });
});

test('Should return default values when mixed type value is strictly true', t => {
    Object.keys(MixedTypes).forEach(mixed => {
        const value = true;
        const type = { type: mixed, defaults: 'default!' }
        const key = 'test';
        const parsed = processConfigEntry(key, value, type);
        t.true(parsed === type.defaults);
    });
});

test('Should return false when mixed type value is strictly false', t => {
    Object.keys(MixedTypes).forEach(mixed => {
        const value = false;
        const type = { type: mixed };
        const key = 'test';
        const parsed = processConfigEntry(key, value, type);
        t.true(parsed === false);
    });
});

test('Should throw an error for incorrect config type in mixed types', t => {
    Object.keys(MixedTypes).forEach(mixed => {
        const value = MixedTypes[mixed].failure;
        const type = { type: mixed };
        const key = 'test';

        let msg;
        if (mixed === 'string-or-bool') {
            msg = configError({ key, value, type: 'string' }, 'boolean');
        }
        if (mixed === 'object-or-bool') {
            msg = configError({ key, value, type: 'object' }, 'boolean');
        }
        if (mixed === 'object-or-bool-or-function') {
            msg = configError({ key, value, type: 'object'}, 'boolean', 'function');
        }

        try {
            const parsed = processConfigEntry(key, value, type);
        } catch (err) {
            t.is(err.message, msg);
        }
    });
});

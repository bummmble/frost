import test from 'ava'
import { loadConfig, validateConfig, processEntry, configError } from '../src/core/config'
import Schema from '../src/core/schema'

const base = {
  entry: {
    client: 'client/index.js',
    server: 'server/index.js'
  },

  output: {
    client: 'build/client',
    server: 'build/server'
  }
}

test('It should return a valid config object', async t => {
  const results = await loadConfig('frost', {})
  t.true(typeof results === 'object')
  t.true(typeof results.config === 'object')
  t.true(typeof results.root === 'string')
})

test('It should successfully apply defaults to a config', t => {
  const results = validateConfig(base, Schema)
  t.true(results.output.public === '/static/')
})

test('It should successfully apply flags to a config', async t => {
  const { config } = await loadConfig('frost', { verbose: true })
  t.true(config.verbose === true )
})

test('Should throw an error when type string or url receives non-string', t => {
  const value = false
  const type = { type: 'string' }
  const key = 'test'
  const msg = configError({ key, value, type: type.type })
  try {
    const parsed = processEntry(key, value, type)
  } catch (err) {
    t.is(err.message, msg)
  }
})

test('Should throw an error when type object-or-bool when it receives a different type', t => {
    const value = 5;
    const type = { type: 'object-or-bool' };
    const key = 'test';
    const msg = configError({ key, value, type: type.type });
    try {
        const parsed = processEntry(key, value, type);
    } catch (err) {
        t.is(err.message, msg);
    }
});

test('Should throw an error when type number recieves non-number', t => {
  const value = false
  const type = { type: 'number' }
  const key = 'test'
  const msg = configError({ key, value, type: type.type })

  try {
    const parsed = processEntry(key, value, type)
  } catch (err) {
    t.is(err.message, msg)
  }
})

test('Should throw an error when type array recieves non-array', t => {
  const value = false
  const type = { type: 'array' }
  const key = 'test'
  const msg = configError({ key, value, type: type.type })

  try {
    const parsed = processEntry(key, value, type)
  } catch (err) {
    t.is(err.message, msg)
  }
})

test('Should throw an error when type path receives non-string', t => {
  const value = true
  const type = { type: 'path' }
  const key = 'test'
  const msg = configError({ key, value, type: type.type })

  try {
    const parsed = processEntry(key, value, type)
  } catch (err) {
    t.is(err.message, msg)
  }
})

test('Should throw an error when type regex receives non-regex', t => {
  const value = true
  const type = { type: 'regex' }
  const key = 'test'
  const msg = configError({ key, value, type: type.type })

  try {
    const parsed = processEntry(key, value, type)
  } catch (err) {
    t.is(err.message, msg)
  }
})

test('Should throw an error when it receives an unknown type', t => {
  const value = true
  const type = { type: 'buffer' }
  const msg = 'Frost: Received an entry in config that is not supported. Found the following Entry \n\n test: true'

  try {
    const parsed = processEntry('test', value, type)
  } catch (err) {
    t.is(err.message, msg)
  }
})


// ----- Success for coverage ------- //

test('Should return when type number is correct', t => {
  const num = 5
  const specs = { type: 'number' }
  const parsed = processEntry('test', num, specs)
  t.true(typeof parsed === 'number')
})

test('Should return when type array is correct', t => {
  const arr = ['test']
  const specs = { type: 'array' }
  const parsed = processEntry('test', arr, specs)
  t.true(Array.isArray(parsed))
})

test('Should return when type regex is correct', t => {
  const regexp = /\.js$/
  const specs = { type: 'regex' }
  const parsed = processEntry('test', regexp, specs)
  t.true(parsed.constructor == RegExp)
})

test('Should return value when object-or-bool is object', t => {
    const value = { test: 'true' };
    const specs = { type: 'object-or-bool' };
    const key = 'test';
    const parsed = processEntry(key, value, specs);
    t.true(typeof parsed === 'object');
} );

test('Should return defaults when boolean in object-or-bool is true', t => {
    const value = true;
    const specs = { type: 'object-or-bool', defaults: { test: 'true' }};
    const key = 'test';
    const parsed = processEntry(key, value, specs);
    t.true(parsed.test === 'true');
});

test('Should return false when boolean in object-or-bool is false', t => {
    const value = false;
    const specs = { type: 'object-or-bool' };
    const key = 'test';
    const parsed = processEntry(key, value, specs);
    t.true(parsed === false);
});

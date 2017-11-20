const test = require('ava');
const express = require('express');
const webpack = require('webpack');
const { buildServer, buildClient, start, connect, getConfig, create, compiler } = require('../dist/index.cjs');

test('Should build client successfully', async t => {
  const config = await getConfig({ verbose: false });
  await buildClient(config).then(result => t.is(result, true));
});

test('Should build client successfully', async t => {
  const config = await getConfig({ verbose: false });
  await buildServer(config).then(result => t.is(result, true));
});

test('Should start a development server', async t => {
  const config = await getConfig({ verbose: false });
  const started = start(config);
  t.is(started, true);
});

test('should create a multi compiler and middleware', async t => {
  const config = await getConfig({ verbose: false });
  const { middleware, multiCompiler } = await create(config);
  t.is(middleware.length, 3);
  t.is(multiCompiler.compilers.length, 2);
});

test('Should work directly with compiler', async t => {
  const config = await getConfig({ verbose: false });
  const build = compiler('client', 'development', config);
  return new Promise(resolve => {
    webpack(build, (err, stats) => {
      const json = stats.toJson({});
      resolve(json);
    });
  }).then(results => {
    t.is(results.errors.length, 0);
  });
});

test('Should throw error when not supplied with a config', async t => {
  try {
    const build = compiler('client', 'development');
  } catch (err) {
    console.log(err);
    t.is(err.message, 'Frost Webpack Compiler needs a configuration object');
  }
});

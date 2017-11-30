const test = require('ava');
const express = require('express');
const { existsSync } = require('fs-extra');
const webpack = require('webpack');
const { buildServer, buildClient, start, connect, loadConfig, create, compiler } = require('../dist/index.cjs');

test('Should build client successfully', async t => {
  const { config } = await loadConfig('frost', { verbose: false });
  await buildClient(config).then(result => t.is(result, true));
});

test('Should build server successfully', async t => {
  const { config } = await loadConfig('frost', { verbose: false });
  await buildServer(config).then(result => t.is(result, true));
});

test('Should start a development server', async t => {
  const { config } = await loadConfig('frost', { verbose: false });
  const started = start(config);
  t.is(started, true);
});

test('should create a multi compiler and middleware', async t => {
  const { config } = await loadConfig('frost', { verbose: false });
  const { middleware, multiCompiler } = await create(config);
  t.is(middleware.length, 3);
  t.is(multiCompiler.compilers.length, 2);
});

test('Should work directly with compiler', async t => {
  const { config } = await loadConfig('frost', { verbose: false });
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

 test('Should throw error in static mode when not supplied with templates', async t => {
  const { config } = await loadConfig('frost');
  config.mode = 'static';
  config.templates = [];
  try {
    await buildClient(config);
  } catch (err) {
    t.is(
      err.message,
      'If running in \'static\' mode the templates array must be populated by htmlWebpackPlugin config options'
    );
  }
})

test('Should generate templates in static mode', async t => {
  const { config } = await loadConfig('frost');
  config.mode = 'static';
  config.templates = [{ filename: 'index.html', template: 'client/index.html' }];
  await buildClient(config);
  t.true(existsSync(`${config.output.client}/${config.templates[0].filename}`));
})

test('Should throw and error when using https without certs', async t => {
  try {
    const { config } = await loadConfig('frost');
    config.serverOptions.useHttps = true;
    start(config);
  } catch (err) {
    t.is(err.message, 'No SSL certs found');
  }
});

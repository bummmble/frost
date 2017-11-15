import test from 'ava';
import express from 'express';
import webpack from 'webpack';
import { getConfig, Logger } from 'frost-shared';
import {
  buildServer,
  buildClient,
  start as startDev,
  connect,
  create,
  compiler,
} from '../src/index';

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
  const started = startDev(config);
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

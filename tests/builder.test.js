import test from 'ava';
import webpack from 'webpack';
import Builder from '../src/core/builder';
import { loadConfig } from '../src/core/config';
import ClientCompiler from '../src/compilers/client';
import ServerCompiler from '../src/compilers/server';

test('It should build a webpack config', async t => {
    const { config } = await loadConfig('frost', {});
    const compiler = ClientCompiler({ isDev: true, isProd: false, isClient: true, isServer: false, webpackTarget: 'web' }, config);
    const builder = new Builder();
    const result = await builder.buildWebpack([compiler], 'development');
    t.true(result === true);
});

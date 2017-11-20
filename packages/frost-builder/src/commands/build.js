import webpack from 'webpack';
import chalk from 'chalk';
import { remove } from 'fs-extra';
import { promisify } from 'frost-utils';

import compiler from '../compiler';
import formatOutput from '../helpers/format';

const removePromise = promisify(remove);

function buildWebpack(target, env, config) {
    const webpackConfig = compiler(target, env, config);
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (error, stats) => {
            return formatOutput(error, stats, target, resolve, reject);
        });
    });
}

export async function buildClient(config) {
    return buildWebpack('client', 'production', config);
}

export async function buildServer(config) {
    return buildWebpack('server', 'production', config);
}

export async function cleanClient(config) {
    await removePromise(config.output.client);
}

export async function cleanServer(config) {
    await removePromise(config.output.server);
}

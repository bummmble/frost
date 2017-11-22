import webpack from 'webpack';
import chalk from 'chalk';
import { remove } from 'fs-extra';
import { promisify } from 'frost-utils';

import compiler from '../compiler';
import formatOutput from '../helpers/format';
import { measureBeforeBuild, printSizes } from '../helpers/filesize';

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
    const sizes = await measureBeforeBuild(config.output.client);
    const { stats, success } = await buildWebpack('client', 'production', config);
    printSizes(
        stats,
        sizes,
        config.output.client,
        512 * 1024,
        1024 * 1024
    );
    return success;
}

export async function buildServer(config) {
    const sizes = await measureBeforeBuild(config.output.server);
    const { stats, success } = await buildWebpack('server', 'production', config);
    printSizes(
        stats,
        sizes,
        config.output.server,
        512 * 1024,
        1024 * 1024
    );
    return success;
}

export async function cleanClient(config) {
    await removePromise(config.output.client);
}

export async function cleanServer(config) {
    await removePromise(config.output.server);
}

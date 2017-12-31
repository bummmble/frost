import webpack from 'webpack';
import pify from 'pify';
import { remove as rmv } from 'fs-extra';
import clientCompiler from './client';
import serverCompiler from './server';
import formatMessages from './format';

const remove = pify(rmv);

function webpackPromise(compiler) {
    return new Promise((resolve, reject) => {
        compiler.plugin('done', stats => resolve(stats));
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }
        });
    });
}

export function createCompiler(target, env) {
    if (target === 'client') {
        return clientCompiler(env);
    } else if (target === 'server') {
        return serverCompiler(env);
    }
}

export function createMultiCompiler(env) {
    const client = clientCompiler(env);
    const server = serverCompiler(env);
    return [client, server];
}

export async function buildTarget(target, env) {
    const compiler = createCompiler(target, env);
    await remove(compiler.output.path);

    const stats = await webpackPromise(webpack(compiler));
    return formatMessages(stats, target);
}

export async function buildClient(env) {
    await buildTarget('client', env);
}

export async function buildServer(env) {
    await buildTarget('server', env);
}

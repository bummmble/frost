import { buildClient, buildServer } from './webpack/compiler';

const args = require('minimist')(process.argv.slice(2));

function getProps() {
    const env = args.prod ? 'production' : 'development';
    const isClient = args.client || false;
    const isServer = args.server || false;

    let target = isServer ? 'server' : 'client';
    if (!isClient && !isServer) target = 'universal';

    return { env, target };
}

async function run() {
    const { env, target } = getProps();
    try {
        if (target === 'client') await buildClient(env);
        if (target === 'server') await buildServer(env);
        if (target === 'universal') {
            await buildClient(env);
            await buildServer(env);
        }
    } catch (err) {
        console.error(err);
    }
}

run();

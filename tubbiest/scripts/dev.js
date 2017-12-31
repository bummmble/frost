import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import express from 'express';
import { resolve } from 'path';
import formatMessages from './webpack/format';
import clientCompiler from './webpack/client';
import serverCompiler from './webpack/server';

function createMiddleware() {
    const clientConfig = clientCompiler('development');
    const serverConfig = serverCompiler('development');
    const multiCompiler = webpack([clientConfig, serverConfig]);
    const client = multiCompiler.compilers[0];
    const publicPath = '/static/';
    const outputPath = resolve(__dirname, '../build/client');

    const devMiddleware = webpackDevMiddleware(multiCompiler, {
        publicPath,
        quiet: true,
        noInfo: true
    });

    const hotMiddleware = webpackHotMiddleware(client);
    const hotServerMiddleware = webpackHotServerMiddleware(multiCompiler, {
        serverRendererOptions: {
            outputPath
        }
    });

    return {
        middleware: [devMiddleware, hotMiddleware, hotServerMiddleware],
        multiCompiler
    };
}

function connect(server, multiCompiler) {
    let isStarted = false;

    multiCompiler.plugin('done', stats => {
        formatMessages(stats, 'universal');

        if (!stats.hasErrors() && !isStarted) {
            isStarted = true;
            server.listen(8000, () => {
                console.log('dev server listening');
            });
        }
    });
}

function main() {
    const app = express();
    app.use('/static', express.static(resolve(__dirname, '../build/client')));

    const { middleware, multiCompiler } = createMiddleware();
    app.use(...middleware);

    connect(app, multiCompiler);
}

main();

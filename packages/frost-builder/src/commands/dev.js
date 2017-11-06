import chalk from 'chalk';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import compiler from '../compiler';
import formatOutput from '../format/output';
//import { createExpressServer } from '../../../frost-server/src/index';
import express from 'express';

export const create = (config = {}) => {
  const clientConfig = compiler('client', 'development', config);
  const serverConfig = compiler('server', 'development', config);
  const multiCompiler = webpack([clientConfig, serverConfig]);
  const clientCompiler = multiCompiler.compilers[0];

  const devMiddleware = webpackDevMiddleware(multiCompiler, {
    publicPath: config.output.public,
    quiet: true,
    noInfo: true,
  });
  const hotMiddleware = webpackHotMiddleware(clientCompiler);
  const hotServerMiddleware = webpackHotServerMiddleware(multiCompiler, {
    serverRendererOptions: {
      outputPath: config.output.client,
    },
  });

  return {
    middleware: [devMiddleware, hotMiddleware, hotServerMiddleware],
    multiCompiler,
  };
};

export const connect = (server, multiCompiler) => {
  let serverIsStarted = false;
  multiCompiler.plugin('invalid', () => {
    console.log('Frost dev server compiling');
  });

  multiCompiler.plugin('done', stats => {
    formatOutput(false, stats);
    if (!stats.hasErrors() && !serverIsStarted) {
      serverIsStarted = true;
      server.listen(process.env.SERVER_PORT, () => {
        console.log(
          `Frost dev server started at port ${process.env.SERVER_PORT}`,
        );
      });
    }
  });
};

export const start = (config = {}) => {
  const { middleware, multiCompiler } = create(config);
  const server = express();
  server.use(...middleware);

  connect(server, multiCompiler);
};

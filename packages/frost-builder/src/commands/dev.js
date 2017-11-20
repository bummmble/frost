import chalk from 'chalk';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import { createExpressServer } from 'frost-express';
import compiler from '../compiler';
import formatOutput from '../helpers/format';

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
    formatOutput(false, stats, 'devServer');
    if (!stats.hasErrors() && !serverIsStarted) {
      serverIsStarted = true;
      server.listen(process.env.SERVER_PORT, () => {
        console.log(
          `Frost dev server started at port ${process.env.SERVER_PORT || 8000}`
        );
      });
    }
  });
};

export const start = (config = {}) => {
  const { middleware, multiCompiler } = create(config);
  const server = createExpressServer({
    afterSecurity: [],
    beforeFallback: [...middleware],
    enableNonce: false,
  });

  connect(server, multiCompiler);

  // for testing only really
  return true;
};

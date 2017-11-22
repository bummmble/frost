import chalk from 'chalk';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import { createExpressServer } from 'frost-express';
import compiler from '../compiler';
import openBrowser from '../helpers/open';
import { formatWebpack } from '../helpers/format';

export function create(config) {
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

export function connect(server, multiCompiler) {
  let serverIsStarted = false;
  multiCompiler.plugin('invalid', () => {
    console.log('Frost dev server compiling');
  });

  multiCompiler.plugin('done', stats => {
    const { errors, warnings } = formatWebpack(stats.toJson({}));
    if (errors.length) {
      console.error(`Frost ran into an error connecting to dev server`);
      console.log(errors.join('\n\n'));
      process.exit(1);
    }

    if (warnings.length && !errors.length) {
      console.warn('Frost noticed some warnings while connecting to the dev server');
      console.log(warnings.join('\n\n'));
    }

    if (!errors.length && !serverIsStarted) {
      serverIsStarted = true;
      server.listen(process.env.SERVER_PORT, () => {
        console.log(
          `Frost dev server started at port ${process.env.SERVER_PORT || 8000}`
        );
        openBrowser(`localhost:${process.env.SERVER_PORT}`);
      });
    }
  });
};

export function start(config) {
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

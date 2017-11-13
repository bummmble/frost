import webpack from 'webpack';
import chalk from 'chalk';
import { remove } from 'fs-extra';
import { promisify } from 'frost-utils';

import compiler from '../compiler';
import formatOutput from '../format/output';

const removePromise = promisify(remove);

const buildClient = (config = {}) => {
  const webpackConfig = compiler('client', 'production', config);
  console.log(webpackConfig);
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      return resolve(formatOutput(error, stats, 'client'));
    });
  });
};

const buildServer = (config = {}) => {
  const webpackConfig = compiler('server', 'production', config);
  return new Promise(resolve => {
    webpack(webpackConfig, (error, stats) => {
      return resolve(formatOutput(error, stats, 'server'));
    });
  });
};

const cleanClient = (config = {}) => {
  return removePromise(config.output.client);
};

const cleanServer = (config = {}) => {
  return removePromise(config.output.server);
};

export { buildClient, buildServer, cleanClient, cleanServer };

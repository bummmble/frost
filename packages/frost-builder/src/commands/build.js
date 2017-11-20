import webpack from 'webpack';
import chalk from 'chalk';
import { remove } from 'fs-extra';
import { promisify } from 'frost-utils';

import compiler from '../compiler';
import formatOutput from '../helpers/format';

const removePromise = promisify(remove);

const buildClient = (config = {}) => {
  const webpackConfig = compiler('client', 'production', config);
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      return formatOutput(error, stats, 'client', resolve, reject);
    });
  });
};

const buildServer = (config = {}) => {
  const webpackConfig = compiler('server', 'production', config);
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      return formatOutput(error, stats, 'server', resolve, reject);
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

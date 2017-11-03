import webpack from 'webpack';
import chalk from 'chalk';
import { remove } from 'fs-extra';

import compiler from '../compiler';
import formatOutput from '../format/output';

const buildClient = (config = {}) => {
  const webpackConfig = compiler('client', 'production', config);
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      return resolve(formatOutput(error, stats));
    });
  });
};

export { buildClient };

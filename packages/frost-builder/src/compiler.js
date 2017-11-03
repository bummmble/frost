import webpack from 'webpack';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { get as getRoot } from 'app-root-dir';
import chalk from 'chalk';

import { removeEmptyKeys } from './utils';

const Root = getRoot();

export default (target, env = 'development', config = {}) => {
	const isClient = target === 'client';
	const isServer = target === 'server';
	const isDev = env === 'development';
	const isProd = env === 'production';
	const name = isServer ? 'server' : 'client';
	const webpackTarget = isServer ? 'node' : 'web';

	const mainEntry = isServer ? entry.server : entry.client;
	const vendorEntry = isServer ? entry.serverVendor : entry.clientVendor;
	const hasMain = existsSync(mainEntry);
	const hasVendor = existsSync(vendorEntry);

	const prefix = chalk.bold(target.toUpperCase());
}
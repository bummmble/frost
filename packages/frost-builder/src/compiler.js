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
	const clientOutput = config.output.client;
	const serverOutput = config.output.server;

	const prefix = chalk.bold(target.toUpperCase());
	const devtool = config.sourceMaps ? 'source-map' : null;

	return {
		name,
		devtool,
		target: webpackTarget,
		context: Root,
		performance: config.performance || {},
		// externals
		entry: removeEmptyKeys({
			vendors: hasVendor ? [
				vendorEntry
			].filter(Boolean) : null,
			main: hasMain ? [
				mainEntry
			].filter(Boolean) : null
		}),

		output: {
			libraryTarget: isServer ? 'commonjs2' : 'var',
			filename: isDev || isServer
				? '[name].js'
				: '[name]-[chunkhash].js',
			chunkFilename: isDev || isServer
				? '[name].js'
				: '[name]-[chunkhash].js',
			path: isServer ? serverOutput : clientOutput
		},

		modules: {
			rules: [
				{
					test: config.files.babel,
					use: {
						loader: 'babel-loader',
						options: config.babel
					}
				}
			]
		}
	};	
}
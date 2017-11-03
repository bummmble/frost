import webpack from 'webpack';
import chalk from 'chalk';
import { remove } from 'fs-extra';

import compiler from '../compiler';
import { formatWebpack } from '../format/webpack';

const buildClient = (config = {}) => {
	const webpackConfig = compiler('client', 'production', config);
	return new Promise((resolve, reject) => {
		webpack(webpackConfig, (error, stats) => {
			const raw = stats.toJson();
			const { errors, warnings } = formatWebpack(raw);

			if (error) {
				const msg = `Fatal error while compiling client. Error: ${error}`;
				console.log(chalk.red(msg));
				return reject(msg);
			}

			if (!errors.length && !warnings.length) {
				console.log(chalk.green('Client build success!'));
			}

			if (errors.length) {
				return reject(errors.join('\n\n'));
			}

			return resolve(true);
		});
	});
};

export {
	buildClient
}
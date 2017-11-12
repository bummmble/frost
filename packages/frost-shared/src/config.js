import { relative, resolve } from 'path';
import { get as getRoot } from 'app-root-dir';
import { set } from 'lodash';
import toBool from 'yn';
import jsome from 'jsome';
import cosmiconfig from 'cosmiconfig';

export const Root = getRoot();
export const Schema = {
	verbose: {
		type: 'boolean',
		default: true
	},

	quiet: {
		type: 'boolean',
		default: false
	},

	mode: {
		type: 'string',
		default: 'srr'
	},

	entry: {
		client: {
			type: 'path',
			default: 'client/index.js'
		},

		server: {
			type: 'path',
			default: 'server/index.js'
		},

		vendor: {
			type: 'path',
			default: 'client/vendor.js'
		}
	},

	output: {
		server: {
			type: 'path',
			default: 'build/server'
		},

		client: {
			type: 'path',
			default: 'build/client'
		},

		public: {
			type: 'url',
			default: '/static/'
		}
	},

	files: {
		babel: {
			type: 'regexp',
			default: /\.(js|mjs|jsx)$/
		},

		styles: {
			type: 'regexp',
			default: /\.(css|sss|pcss)$/
		},

		images: {
			type: 'regexp',
			default: /\.(jpg|png|gif)$/
		},

		fonts: {
			type: 'regexp',
			default: /\.(eot|svg|otf|ttf|woff|woff2)$/
		},

		video: {
			type: 'regexp',
			default: /\.(mp4|webm)$/
		}
	},

	locale: {
		default: {
			type: 'string',
			default: 'en-US'
		},
		supported: {
			type: 'array',
			default: ['en-US']
		}
	},

	hook: {
		webpack: {
			type: 'script',
			default: 'hooks/webpack.js'
		}
	}
};

export async function loadConfig(prefix ='frost', flags = {}) {
	const configLoader = cosmiconfig(prefix, {
		rcExtensions: true,
		storDir: Root
	});

	let configResult;

	try {
		configResult = await configLoader.load(Root);
	} catch (err) {
		throw new Error(`Error parsing config file: ${err}. Root: ${Root}`);
	}

	const config = configResult.config;
	for (const key in flags) {
		set(config, key, flags[key]);
	}

	await processConfig(config, SCHEMA);

	const configRoot = relative(Root, configResult.filepath);

	if (config.verbose) {
		console.log(`Config from ${configRoot}`);
		jsome(config);
	}

	return {
		config,
		root: configRoot
	};
}

async function processConfig(config, schema) {
	for (const key in schema) {
		const specs = schema[key];
		const value = config[key] || {};

		if (specs.type == null) {
			config[key] = (await processConfig(value, specs)) || value;
		} else {
			config[key] = await processEntry(value, specs);
		}
	}
}

const ident = item => item;

// TODO: Pass in the config[key] here so you can throw better errors with location
async function processEntry(value, specs) {
	let parsed;

	switch (specs.type) {
		case 'string':
			if (typeof value !== 'string') {
				throw new Error('Invalid config value for type string');
			}
			return String(value);

		case 'number':
			parsed = parseFloat(value, 10);
			if (isNaN(parsed)) {
				throw new Error('Invalid config for type number');
			}
			return parsed;

		case 'boolean':
			return toBool(value);

		case 'path':
			if (typeof value !== 'string') {
				throw new Error('Invalid config value for type path, needs to be a string');
			}
			return resolve(Root, value);

		case 'url':
			if (typeof value !== 'string') {
				throw new Error('Invalid config value for url');
			}
			return value;

		case 'array':
			if (!Array.isArray(value)) {
				throw new Error('Invalid config for type array');
			}
			return value;

		case 'regexp':
			if (!value instanceof RegExp) {
				throw new Error('Invalid config for type regexp');
			}
			return value;

		case 'script':
			try {
				parsed = await import(resolve(Root, value));
			} catch (err) {
				parsed = null;
			}

			return parsed ? parsed.default || parsed : ident;

		default:
			throw new Error(`Unsupported entry type in config ${specs.type}`);
	}
}

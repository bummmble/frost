import cosmiconfig from 'cosmiconfig';
import { get as getRoot } from 'app-root-dir';
import { relative, resolve } from 'path';
import jsome from 'jsome';

import Schema from './schema';

export const Root = getRoot();

export const configError = ({ key, value, type }) =>
    `Frost: The config for ${key} is of the wrong type. Frost expected a ${type} but received ${typeof value}`;

export function validateConfig(config, schema) {
    for (const key in schema) {
        const structure = schema[key];
        const value = config[key] || {};

        // Validate existing config entries and supply defaults for the rest
        if (!structure.type) {
            config[key] = validateConfig(value, structure);
        } else {
            if (value) {
                config[key] = processEntry(key, value, structure);
            } else {
                config[key] = structure.defaults;
            }
        }
    }

    return config;
}

export function processEntry(key, value, { type }) {
    const props = { key, value, type };
    let parsed;

    switch (type) {
        case 'string':
        case 'url':
            if (typeof value !== 'string') {
                throw new Error(configError(props));
            }
            return value;

        case 'number':
            parsed = parseFloat(value, 10);
            if (isNaN(parsed)) {
                throw new Error(configError(props));
            }
            return parsed;

        case 'array':
            if (!Array.isArray(value)) {
                throw new Error(configError(props));
            }
            return value;

        case 'boolean':
            return !!value;

        case 'regex':
            if (value.constructor !== RegExp) {
                throw new Error(configError(props));
            }
            return value;

        case 'path':
            if (typeof value !== 'string') {
                throw new Error(configError(props));
            }
            return resolve(Root, value);

        default:
            throw new Error(`Frost: Received an entry in config that is not supported. Found the following Entry \n\n ${key}: ${value}`);
    }
}

export async function loadConfig(prefix = 'frost', flags = {}) {
    const loader = cosmiconfig(prefix, {
        rcExtensions: true,
        stopDir: Root
    });

    const result = await loader.load(Root);
    const config = validateConfig(result.config);

    const root = relative(Root, result.filepath);
    config.root = root;

    for (const key in flags) {
        config[key] = flags[key];
    }

    return { config, root };
}

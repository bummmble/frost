import cosmiconfig from 'cosmiconfig';
import { resolve, relative } from 'path';
import { get as getRoot } from 'app-root-dir';

import Schema from './schema';
import { isString, isBoolean, isObject, isFunction } from '../utils';

export const Root = getRoot();

export const configError = ({ key, value, type }, type2, type3) => `
    Frost: the config for ${key} is of the wrong type.
    Frost expected type ${type2
        ? type3
            ? `${type} or ${type2} or ${type3}`
            : `${type} or ${type2}`
        : type}
    but received ${typeof value}
`;

export function processConfigEntry(key, value, { type, defaults }) {
    const props = { key, value, type };
    let parsed;

    switch (type) {
        case 'string':
        case 'url':
        case 'path':
            if (!isString(value)) {
                throw new Error(configError(props));
            }
            if (type === 'path') {
                return resolve(Root, value);
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

        case 'object':
            if (!isObject(value)) {
                throw new Error(configError(props));
            }
            return value;

        case 'regex':
            if (value.constructor !== RegExp) {
                throw new Error(configError(props));
            }
            return value;

        case 'string-or-bool':
            if (!isString(value) && !isBoolean(value)) {
                throw new Error(configError({
                    ...props,
                    type: 'string'
                }, 'boolean'));
            }
            if (isString(value)) {
                return value;
            }
            if (value === true) {
                return defaults;
            }
            return false;

        case 'object-or-bool':
            if (!isObject(value) && !isBoolean(value)) {
                throw new Error(configError({
                    ...props,
                    type: 'object'
                }, 'boolean'));
            }
            if (isObject(value)) {
                return value;
            }
            if (value === true) {
                return defaults;
            }
            return false;

        case 'object-or-bool-or-function':
            if (!isObject(value) && !isBoolean(value) && !isFunction(value)) {
                throw new Error(configError({
                    ...props,
                    type: 'object'
                }, 'boolean', 'function'));
            }
            if (isObject(value) || isFunction(value)) {
                return value;
            }
            if (value === true) {
                return defaults;
            }
            return false;
    }
}

export function validateConfig(config, schema) {
    return Object.keys(schema).reduce((acc, curr) => {
        const structure = schema[curr];
        const value = config[curr] || {};

        if (!structure.type) {
            acc[curr] = validateConfig(value, structure)
        } else {
            if (config[curr]) {
                acc[curr] = processConfigEntry(curr, value, structure);
            } else {
                acc[curr] = structure.defaults;
            }
        }

        return acc;
    }, {});
}

export function setFlags(flags, config) {
    for (const key in flags) {
        config[key] = flags[key];
    }
    return config;
}

export async function loadConfig(prefix = 'frost', flags = {}) {
    const loader = cosmiconfig(prefix, {
        rcExtensions: true,
        stopDir: Root
    });

    const result = await loader.load(Root);
    const root = relative(Root, result.filepath);
    const config = validateConfig(setFlags(flags, result.config), Schema);
    config.root = root;

    return config;
}

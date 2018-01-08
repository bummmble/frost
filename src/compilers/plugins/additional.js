import { isObject, isFunction, isString } from '../../utils';

export function createProvidedPlugin(type, { plugins }) {
    return plugins[type].map(plugin => {
        if (isObject(plugin) || isFunction(plugin)) {
            return plugin;
        }
        if (isString(plugin)) {
            const resolved = require.resolve(plugin);
            const p = require(resolved);
            return new p();
        }
    });
}

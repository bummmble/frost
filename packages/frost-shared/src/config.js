import cosmiconfig from 'cosmiconfig';
import { get as getRoot } from 'app-root-dir';
import { relative, resolve, join } from 'path';
import { get, set, defaultsDeep } from 'lodash';
import jsome from 'jsome';

import defaults from './defaults';

export const Root = getRoot();

const resolveFor = [
    'entry.server',
    'entry.client',
    'output.server',
    'output.client'
];

const Loaders = [ 'hook.webpack' ];

const configLoader = cosmiconfig('frost', {
    rcExtensions: true,
    stopDir: Root
});

const configPromise = configLoader
    .load(Root)
    .then(results => {
        console.log(`Loaded config from ${relative(Root, results.filepath)}`);
        const merged = defaultsDeep(results.config, defaults);
        return resolvePathsInConfig(merged, Root);
    })
    .catch(err => {
        throw new Error(`Error parsing config file: ${err}. Root: ${Root}`);
    });

if (!configPromise) {
    console.error('no configuration file found!!');
    process.exit(1);
}

export async function getConfig(flags) {
    return await configPromise
        .then(config => {
            for (const key in flags) {
                set(config, key, flags[key]);
            }

            if (flags.verbose) {
                jsome(config);
            }

            return config;
        })
        .then(async config => {
            const loadedModules = await Promise.all(
                Loaders.map(module => {
                    const file = get(config, module);
                    if (file) {
                        console.log('import file');
                    } else {
                        return null;
                    }
                })
            );

            Loaders.forEach((module, index) => {
                const loadedModule = loadedModules[index];
                if (loadedModule) {
                    set(config, module, loadedModule.default || loadedModule);
                }
            });

            return config;
        })
        .catch(err => {
            console.error(err);
        })
}

function resolvePathsInConfig(config) {
    resolveFor.forEach(entry => {
        if (get(config, entry) != null) {
            set(config, entry, resolve(Root, get(config, entry)))
        }
    });

    return config;
}

import cosmiconfig from 'cosmiconfig';
import { get as getRoot } from 'app-root-dir';
import { relative, resolve, join } from 'path';
import { get, set, defaultsDeep } from 'lodash';
import jsome from 'jsome';
import defaults from './defaults';

export const Root = getRoot();

const resolveFor = [
  'entry.client',
  'entry.server',
  'output.server',
  'output.client',
];

const moduleLoaders = ['hook.webpack'];

const configLoader = cosmiconfig('frost', {
  rcExtensions: true,
  stopDir: Root,
});

const configPromise = configLoader
  .load(Root)
  .then(result => {
    if (
      typeof result !== 'object' ||
      result.config == null ||
      result.filepath == null
    ) {
      throw new Error('Invalid config options');
    }

    const merged = defaultsDeep(result.config, defaults);
    return resolvePathsInConfig(merged, Root);
  })
  .catch(err => {
    throw new Error('Error parsing config file');
  });

if (!configPromise) {
  console.error('missing config file');
  process.exit(1);
}

export async function getConfig(flags) {
  return await configPromise
    .then(config => {
      for (const key in flags) {
        set(config, key, flags[key]);
      }

      if (flags.verbose) {
        console.log('configuration');
        jsome(config);
      }

      return config;
    })
    .then(async config => {
      const loaded = await Promise.all(
        moduleLoaders.map(modulePath => {
          const moduleFile = get(config, modulePath);
          if (moduleFile) {
            return require(join(Root, moduleFile));
          } else {
            return null;
          }
        })
      );

      moduleLoaders.forEach((modulePath, index) => {
        const loadedModule = loaded[index];
        if (loadedModule) {
          set(config, modulePath, loadedModule.default || loadedModule);
        }
      });

      return config;
    });
}

function resolvePathsInConfig(config) {
  resolveFor.forEach(entry => {
    if (get(config, entry) != null) {
      set(config, entry, resolve(Root, get(config, entry)));
    }
  });

  return config;
}

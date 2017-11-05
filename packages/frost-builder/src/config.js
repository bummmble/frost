import cosmiconfig from 'cosmiconfig';
import { get as getRoot } from 'app-root-dir';
import { get, set, defaultsDeep } from 'lodash';
import { relative, resolve, join } from 'path';
import chalk from 'chalk';
import defaults from './defaults';

const Root = getRoot();
const resolveFor = [
  'entry.client',
  'entry.server',
  'entry.clientVendor',
  'output.server',
  'output.client',
];

const configLoader = cosmiconfig('frost', {
  stopDir: Root,
});

const configPromise = configLoader
  .load(Root)
  .then(results => {
    const merged = defaultsDeep(results.config, defaults);
    return resolvePaths(merged);
  })
  .catch(error => {
    throw new Error(`Error parsing frost-config file: ${error}`);
  });

const getConfig = async flags => {
  return await configPromise.then(config => {
    for (const key in flags) {
      set(config, key, flags[key]);
    }
    return config;
  });
};

const resolvePaths = config => {
  resolveFor.forEach(loc => {
    if (get(config, loc) != null) {
      set(config, loc, resolve(Root, get(config, loc)));
    }
  });
  return config;
};

export { Root, getConfig };

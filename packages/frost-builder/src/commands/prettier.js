import chalk from 'chalk';
import glob from 'glob';
import { resolve } from 'path';
import { get as getRoot } from 'app-root-dir';
import { exec } from '../helpers/exec';

const Root = getRoot();
const isWindows = process.platform === 'win32';
const prettierName = isWindows ? 'prettier.cmd' : 'prettier';
const prettierCmd = resolve(Root, `node_modules/.bin/${prettierName}`);

export default ({ prettier }, mode) => {
  const shouldWrite = mode === 'write' || mode === 'write-changed';
  const onlyChanged = mode === 'write-changed';
  const { options, config } = prettier;

  Object.keys(config).forEach(key => {
    const patterns = config[key].patterns;
    const _options = config[key].options;
    const ignore = config[key].ignore;
    const globPattern =
      patterns.length > 1 ? `{${patterns.join(',')}}` : `${patterns.join(',')}`;
    const files = glob.sync(globPattern, { ignore }).filter(f => !onlyChanged);

    if (!files.length) {
      return;
    }

    const args = Object.keys(options).map(
      k => `--${k}=${(_options && _options[k]) || options[k]}`
    );
    args.push(`--${shouldWrite ? 'write' : 'l'}`);

    try {
      exec(prettierCmd, [...args, ...files]).trim();
    } catch (e) {
      if (!shouldWrite) {
        process.exit(1);
      }
      throw e;
    }
  });
};

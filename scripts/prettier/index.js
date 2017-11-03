'use strict';

const chalk = require('chalk');
const glob = require('glob');
const { resolve } = require('path');
const { execFileSync } = require('child_process');
const mode = process.argv[2] || 'check';
const shouldWrite = mode === 'write' || mode === 'write-changed';
const onlyChanged = mode === 'check-changed' || mode === 'write-changed';

const isWindows = process.platform === 'win32';
const prettierName = isWindows ? 'prettier.cmd' : 'prettier';
const prettierCmd = resolve(
  __dirname,
  `../../node_modules/.bin/${prettierName}`,
);
const defaultOptions = {
  'bracket-spacing': 'true',
  'single-quote': 'true',
  'jsx-bracket-same-line': 'true',
  'trailing-comma': 'all',
  'print-width': 80,
};

const config = {
  default: {
    patterns: ['packages/**/*.js', 'packages/*/src/**/*.js'],
    ignore: ['**/node_modules/**'],
  },
  scripts: {
    patterns: ['scripts/**/*.js'],
    ignore: ['**/node_modules/**'],
  },
};

const exec = (command, args) => {
  console.log(`> ${[command].concat(args).join(' ')}`);
  const options = {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'pipe',
    encoding: 'utf-8',
  };
  return execFileSync(command, args, options);
};

Object.keys(config).forEach(key => {
  const patterns = config[key].patterns;
  const options = config[key].options;
  const ignore = config[key].ignore;
  const globPattern =
    patterns.length > 1 ? `{${patterns.join(',')}}` : `${patterns.join(',')}`;
  const files = glob.sync(globPattern, { ignore }).filter(f => !onlyChanged);

  if (!files.length) {
    return;
  }

  const args = Object.keys(defaultOptions).map(
    k => `--${k}=${(options && options[k]) || defaultOptions[k]}`,
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

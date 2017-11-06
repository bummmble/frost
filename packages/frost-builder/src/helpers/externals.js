import { readdirSync } from 'fs';
import { resolve } from 'path';
import { readJsonSync } from 'fs-extra';
import builtinModules from 'builtin-modules';

const root = 'node_modules';

const BuiltIns = new Set(builtinModules);
const Modules = new Set();
const Binaries = new Set();
const WebpackRequired = new Set([
  'react-universal-component',
  'webpack-flush-chunks',
]);

const nodePackages = readdirSync(root).filter(
  dirname => dirname.charAt(0) !== '.',
);
nodePackages.forEach(pkg => {
  let json;
  try {
    json = readJsonSync(resolve(root, pkg, 'package.json'));
  } catch (error) {}

  if (json.module || json.style || json['jsnext:main']) {
    Modules.add(pkg);
  }

  // Config for Node-Pre-Gyp
  // See https://www.npmjs.com/package/node-pre-gyp
  if (json.binary != null) {
    Binaries.add(pkg);
  }
});

const Problematic = new Set([
  // 'intl' is included in one block. No reason to bundle everything
  'intl',

  // 'mime-db' for mime-types. Naturally very large
  'mime-db',

  // 'encoding' uses dynamic iconv loading
  'encoding',

  // Native code helper
  'node-gyp',
  'node-pre-gyp',

  // These modules use dynamic requires which do not play well with Webpacj
  'ajv',
  'colors',
  'express',
  'jsdom',
]);

console.log('ESM:', Modules);
console.log('Binaries:', Binaries);
console.log('Problematic:', Problematic);

export const isLoaderSpecific = req => {
  return !!/\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|webm|ico|mp4|mp3|ogg|html|pdf|swf|css|scss|sass|sss|less)$/.exec(
    req,
  );
};

export default () => {
  return (context, req, cb) => {
    const basename = req.split('/')[0];

    // Externalize builtins
    if (BuiltIns.has(basename)) {
      return cb(null, `commonjs ${req}`);
    }

    // Externalize binaries
    if (Binaries.has(basename)) {
      return cb(null, `commonjs ${req}`);
    }

    // Externalize problematic commonjs
    if (Problematic.has(basename)) {
      return cb(null, `commonjs ${req}`);
    }

    // Ignore inline files
    if (basename.charAt(0) === '.') {
      return cb();
    }

    // Inline all modules
    if (Modules.has(basename)) {
      return cb();
    }

    // Inline modules that need a webpack env
    if (isLoaderSpecific(req)) {
      return cb();
    }

    return cb(null, `commonjs ${req}`);
  };
};

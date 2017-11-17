import { readdirSync, readJsonSync, existsSync } from 'fs-extra';
import { resolve } from 'path';
import builtinModules from 'builtin-modules';
import resolvePkg from 'resolve-pkg';
import Logger from 'frost-shared';

const BuiltIns = new Set(builtinModules);
const WebpackRequired = new Set([
  'react-universal-component',
  'webpack-flush-chunks',
  'babel-plugin-universal-import',
]);

const Problematic = new Set([
  'intl',
  'mime-db',
  'encoding',
  'ajv',
  'colors',
  'jsdom',
]);

export const isLoaderSpecific = req => {
  if (req.charAt(0) === '!') {
    return true;
  }

  return Boolean(
    /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|webm|ico|mp4|mp3|ogg|html|pdf|css|scss|sass|sss|less|zip)$/.exec(
      req
    )
  );
};

const cache = {};
export const shouldBeBundled = name => {
  if (name in cache) {
    return cache[name];
  }

  let resolved;
  try {
    resolved = resolvePkg(name);
  } catch (error) {
    return null;
  }

  // Default
  let result = null;

  // Detect Node-Gyp Bindings
  // 'describes the configuration to build your module in a JSON like format'
  const hasBindings = existsSync(resolve(resolved, 'bindings.gyp'));
  if (hasBindings) {
    result = false;
  } else {
    let json;
    try {
      json = readJsonSync(resolve(resolved, 'package.json'));
    } catch (error) {}

    if (json) {
      if (json.module || json.style || json.browser || json['jsnext:main']) {
        result = true;
      }

      if (json.binary != null) {
        result = false;
      }
    }
  }

  cache[name] = result;
  return result;
};

export const isExternalReq = req => {
  // Inline all files that depend on loaders
  if (isLoaderSpecific(req)) {
    return false;
  }

  const basename = req.split('/')[0];

  if (BuiltIns.has(basename)) {
    return true;
  }

  // Ignore inline files for later processing
  if (basename.charAt(0) === '.') {
    return false;
  }

  // Inline all files that need a webpack env
  if (WebpackRequired.has(basename)) {
    return false;
  }

  if (Problematic.has(basename)) {
    return true;
  }

  // Analyzes remaining packages to see whether they offer es2015 bundles
  // and/or include native extensions via GYP. Try to bundle all modules
  // as it is better for tree-shaking.

  const bundle = shouldBeBundled(basename);
  if (bundle != null) {
    return !bundle;
  }

  return false;
};

const externalCache = {};

export const getExternals = entries => {
  const entriesSet = new Set(entries);
  return (context, req, cb) => {
    if (entriesSet.has(req)) {
      return cb();
    }

    let isExternal = externalCache[req];
    if (isExternal == null) {
      isExternal = isExternalReq(req);
      externalCache[req] = isExternal;
    }

    return isExternal ? cb(null, `commonjs ${req}`) : cb();
  };
};

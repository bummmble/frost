import { resolve } from 'path';
import { existsSync, readJsonSync } from 'fs-extra';
import builtinModules from 'builtin-modules';
import resolvePkg from 'resolve-pkg';

const BuiltIns = new Set(builtinModules);
const WebpackRequired = new Set([
    // These are necessary for universal imports
    'react-universal-component',
    'webpack-flush-chunks',
    'babel-plugin-universal-import'
]);

const Problematic = new Set([
    'intl',
    'mime-db',
    'encoding',
    'ajv',
    'colors',
    'jsdom'
]);

const bundleCache = {};
const externalsCache = {};

export function isLoaderFile(req) {
    if (req.charAt(0) === '!') {
        return true;
    }

    return Boolean(
       /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|webm|ico|mp4|mp3|ogg|html|pdf|css|scss|sass|sss|less|zip)$/.exec(req)
    );
}

function shouldTry(resolved) {
    let json;

    try {
        json = readJsonSync(resolve(resolved, 'package.json'));
    } catch (err) {

    }
}

export function shouldBundlePackage(resolved) {
    let result = null;

    const hasBinding = existsSync(resolve(resolved, 'bindings.gyp'));
    if (hasBinding) {
        result = false;
    } else {
        const json = shouldTry(resolved);

        if (json) {
            if (json.module || json.style || json.browser || json['jsnext:main']) {
                result = true;
            }

            if (json.binary != null) {
                result = false;
            }
        }
    }

    return result;
}

export function shouldBeBundled(base) {
    if (base in bundleCache) {
        return bundleCache[base];
    }

    let resolved;
    try {
        resolved = resolvePkg(base);
    } catch (err) {
        return null;
    }

    const result = resolved ? shouldBeBundled(resolved) : null;
    bundleCache[base] = result;
    return result;
}

export function isExternalRequest(req) {
    if (req.charAt(0) === '.') {
        return false;
    }

    if (isLoaderFile(req)) {
        return false;
    }

    const match = (/^((@[a-zA-Z0-9-_]+\/)?[a-zA-Z0-9_-]+)\/?/).exec(req);
    const basename = match ? match[1] : null;

    if (basename == null) {
        return true;
    }

    if (BuiltIns.has(basename)) {
        return true;
    }

    if (WebpackRequired.has(basename)) {
        return false;
    }

    if (Problematic.has(basename)) {
        return true;
    }

    const bundle = shouldBeBundled(basename);
    if (bundle != null) {
        return !bundle;
    }

    return false;
}

export function getExternals(light, entries) {
    const entriesSet = new Set(entries);
    return (context, req, cb) => {
        if (entriesSet.has(req)) {
            return cb();
        }

        let isExternal = externalsCache[req];
        if (isExternal == null) {
            isExternal = isExternalRequest(req, light);
            externalsCache[req] = isExternal;
        }

        return isExternal ? cb(null, `commonjs ${req}`) : cb();
    }
}

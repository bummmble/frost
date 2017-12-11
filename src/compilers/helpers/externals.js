import { resolve } from 'path';
import { existsSync, readJsonSync } from 'fs-extra';
import builtinModules from 'builtin-modules';
import resolvePkg from 'resolve-pkg';

const BuiltIns = new Set(builtinModules);
const WebpackRequired = new Set([
    // These are required for universal imports to work properly
    'react-universal-component',
    'webpack-flush-chunks',
    'babel-plugin-universal-import'
]);

const Problematic = new Set([
    // These are things that are generally large or have problematic
    // commonJS functionality
    'intl',
    'mime-db',
    'encoding',
    'ajv',
    'colors',
    'jsdom'
]);

const BundleCache = {};
const ExternalsCache = {};

export function isLoaderFile(req) {
    if (req.charAt(0) === '!') {
        return true;
    }

    return Boolean(
       /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|gif|webp|webm|ico|mp4|mp3|ogg|html|pdf|css|scss|sass|sss|less|zip)$/.exec(req)
    );
}

function tryResolveJson(resolved) {
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
        const json = tryResolveJson(resolved);
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
    if (base in BundleCache) {
        return BundleCache[base];
    }

    let resolved;
    try {
        resolved = resolvePkg(base);
    } catch (err) {
        return null;
    }

    const result = resolved ? shouldBeBundled(resolved) : null;
    BundleCache[base] = result;
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

    if (basename == null || Problematic.has(basename) || BuiltIns.has(basename)) {
        return true;
    }
    if (WebpackRequired.has(basename)) {
        return false;
    }

    const bundle = shouldBeBundled(basename);
    if (bundle != null) {
        return !bundle;
    }
    return false;
}

export function getExternals(entries) {
    const Entries = new Set(entries);
    return (ctx, req, cb) => {
        if (Entries.has(req)) {
            return cb();
        }

        let isExternal = ExternalsCache[req];
        if (isExternal == null) {
            isExternal = isExternalRequest(req);
            ExternalsCache[req] = isExternal;
        }

        return isExternal ? cb(null, `commonjs ${req}`) : cb();
    }
}

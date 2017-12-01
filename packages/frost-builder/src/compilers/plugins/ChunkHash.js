/** This is a slightly more modern approach to hashing than the
 *  'webpack-md5-hash'. For some reason the SHA256 Version does not always
 *  work as intended and creates different hashes for the same content, hurting
 *  our caching strategies. This is simply a replacement of the md5 with the
 *  loader-utils implementation which also supports short generated hashes using
 *  base62 encoding instead of hex
 */

import { getHashDigest } from 'loader-utils';

const HashType = 'sha256';
const DigestType = 'base62';
const DigestLength = 8;

function compareModules(a, b) {
    if (a.resource < b.resource) {
        return -1;
    }
    if (a.resource > b.resource) {
        return 1;
    }
    return 0;
}

function getSource(module) {
    const source = module._source || {};
    return source._value || '';
}

function concatenateSource(result, source) {
    return result + source;
}

export default class ChunkHash {
    apply(compiler) {
        compiler.plugin('compilation', compilation => {
            compilation.plugin('chunk-hash', (chunk, chunkHash) => {
                const source = chunk
                    .mapModules(module => module)
                    .sort(compareModules)
                    .map(getSource)
                    .reduce(concatenateSource, '');
                const hash = getHashDigest(source, HashType, DigestType, DigestLength);

                chunkHash.digest = function() {
                    return hash;
                }
            });
        });
    }
}

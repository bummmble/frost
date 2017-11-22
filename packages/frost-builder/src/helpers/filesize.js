import filesize from 'filesize';
import recursive from 'recursive-readdir';
import stripAnsi from 'strip-ansi';
import { readFileSync } from 'fs-extra';
import { join, basename, dirname } from 'path';
import { sync as gzipSize } from 'gzip-size';
import { Logger } from '../logger';

function removeFileHash(build, name) {
    return name
        .replace(build, '')
        .replace(
            /\/?(.*)(\.[0-9a-f]+)(\.chunk)?(\.js|\.css)/,
            (match, a, b, c, d) => a + d
        );
}

function getDifference(current, previous) {
    const fiftyKb = 1024 * 50;
    const diff = current - previous;
    const fileSize = !Number.isNaN(diff) ? filesize(diff) : 0;
    if (diff > fiftyKb) {
        return console.log(Logger.error(`+ ${fileSize}`));
    } else if (diff < fiftyKb && diff > 0) {
        return console.log(Logger.warn(`+ ${fileSize}`));
    } else if (diff < 0) {
        return console.log(Logger.success(fileSize));
    } else {
        return '';
    }
}

export function measureBeforeBuild(build) {
    return new Promise(resolve => {
        recursive(build, (err, filenames) => {
            let sizes;
            if (!err && filenames) {
                sizes = filenames
                    .filter(filename => /\.(js|css)$/.test(filename))
                    .reduce((acc, curr) => {
                        const contents = readFileSync(curr);
                        const key = removeFileHash(build, curr);
                        acc[key] = gzipSize(contents);
                        return acc;
                    }, {});
            }

            resolve({
                root: build,
                sizes: sizes || {}
            });
        });
    });
}

export function printSizes(stats, previousSizes, build, maxBundleSize, maxChunkSize) {
    const { root, sizes } = previousSizes;
    const assets = stats
        .toJson()
        .assets.filter(asset => /\.(js|css)$/.test(asset.name))
        .map(asset => {
            const contents = readFileSync(join(root, asset.name))
            const size = gzipSize(contents);
            const previousSize = sizes[removeFileHash(root, asset.name)];
            const diff = getDifference(size, previousSize);
            return {
                folder: join(basename(build), dirname(asset.name)),
                name: basename(asset.name),
                size,
                sizeLabel: filesize(size) + (diff ? ` (${diff})` : '')
            };
        });

    assets.sort((a, b) => b.size - a.size);

    const longestLabel = Math.max(null, assets.map(asset => stripAnsi(asset.sizeLabel).length));

    assets.forEach(asset => {
        let { sizeLabel } = asset;
        const sizeLength = stripAnsi(sizeLabel).length;
        if (sizeLength < longestLabel) {
            const rightPadding = ' '.repeat(longestLabel - sizeLength);
            sizeLabel += rightPadding
        }

        console.log(`${sizeLabel} ${asset.folder} ${asset.name}`);
    })
}

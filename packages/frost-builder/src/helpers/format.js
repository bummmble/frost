import { Logger } from '../logger';

const exportError = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/;

function formatRaw(message, err) {
    let lines = message.split('\n');

    if (lines.lengh > 2 && lines[1] === '') {
        lines.splice(1, 1);
    }

    // Removes Webpack-specific loader notation
    if (lines[0].lastIndexOf('!') !== -1) {
        lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
    }

    // cleans up entry point additions
    lines = lines.filter(line => lines.indexOf(' @ ') !== 0);

    // lines[0] is the filename
    // lines[1] is the main error message
    if (!lines[0] || !lines[1]) {
        return lines.join('\n');
    }

    if (lines[1].indexOf('Module not found: ') === 0) {
        lines = [
            lines[0],
            lines[1]
                .replace("Cannot resolve 'file' or 'directory' ", '')
                .replace('Cannot resolve module ', '')
                .replace('Error: ', '')
        ];
    }

    // Cleans export errors
    if (lines[1].match(exportError)) {
        lines[1] = lines[1].replace(
            exportError,
            "$1 '$4' does not contain an export named '$3'."
        );
    }



    message = lines.join('\n');

    // strip internal stacks except for the ones containing 'webpack:'
    message = message
        .replace(
            /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm,
            ''
        )
        .replace('./~/css-loader!./~/postcss-loader!', '')

    return message.trim();
}

export function formatWebpack(json) {
    const errors = json.errors.map(error => formatRaw(error, true));
    const warnings = json.warnings.map(warning => formatRaw(warning, false));
    return { errors, warnings };
}

const isMultiStats = stats => stats.stats;

const getCompileTime = stats => {
    if (isMultiStats(stats)) {
        return stats.stats.reduce((time, stats) => {
            return Math.max(time, getCompileTime(stats));
        }, 0);
    }
    return stats.endTime - stats.startTime;
};

export default function formatOutput(error, stats, target, resolve, reject) {
    if (error) {
        const msg = `Fatal error while compiling ${taget}: ${error}`;
        console.error(Logger.err(msg));
        return reject(msg);
    }

    const raw = stats.toJson({});
    const { errors, warnings } = formatWebpack(raw);

    const isSuccessful = !errors.length && !warnings.length;
    if (isSuccessful) {
        console.log(Logger.success(`Compiled ${target} successfully`));
    }

    if (errors.length) {
        console.error(Logger.error(`Failed to compile ${target}`));
        console.log(errors.join('\n\n'));
        return reject(`Failed to compile ${target}`);
    }

    if (warnings.length && !errors.length) {
        console.log(Logger.warning(`Compiled ${target} with warnings`));
        console.log(warnings.join('\n\n'));
    }

    const compileTime = getCompileTime(stats);
    console.log(Logger.info(`${target} compiled in: ${compileTime}ms`));
    return resolve({
        stats,
        success: true
    });
}

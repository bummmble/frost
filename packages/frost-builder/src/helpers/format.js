import { Logger } from '../logger';

function formatRaw(message, err) {
    let lines = message.split('\n');

    if (lines.lengh > 2 && lines[1] === '') {
        lines.splice(1);
    }
    if (lines[0].lastIndexOf('!') !== -1) {
        lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
    }

    lines = lines.filter(line => lines.indexOf(' @ ') !== 0);
    if (!lines[0] || !lines[1]) {
        return lines.join('\n');
    }

    message = lines.join('\n');
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
    return resolve(true);
}

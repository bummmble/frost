import chalk from 'chalk';

const ExportError = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/
const WebpackStacks = /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm
const isSyntaxError = msg => msg.includes('Syntax Error');

const isMultiStats = stats => stats.stats;

function getCompileTime(stats) {
    if (isMultiStats(stats)) {
        return stats.stats.reduce((time, stats) => {
            return Math.max(time, getCompileTime(stats));
        }, 0);
    }
    return stats.endTime - stats.startTime;
}

function formatWebpackMessage(message, isError) {
    let lines = message.split('\n');

    // Removes extra newline
    if (lines.length > 2 && lines[1] === '') {
        lines.splice(1, 1);
    }

    // Remove webpack-loader notation from filenames
    // as seeing ./~/babel-loader!./src/index.js is
    // annoying
    if (lines[0].lastIndexOf('!') !== -1) {
        lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
    }

    // Remove webpack entry points from messages as it
    // is often misleading for anything but syntax errors
    lines = lines.filter(line => line.indexOf(' @ ') !== 0);

    // lines[0] is a filename
    // lines[1] is the error message
    if (!lines[0] || !lines[1]) {
        return lines.join('\n');
    }

    // Cleans syntax error
    if (lines[1].indexOf('Module build failed: ') === 0) {
        lines[1] = lines[1].replace(
            'Module build failed: SyntaxError',
            'Syntax Error'
        )
    }

    // Cleans export errors
    if (lines[1].match(ExportError)) {
        lines[1] = lines[1].replace(
            ExportError,
            "$1 '$4' does not contain an export named '$3'."
        );
    }

    message = lines.join('\n');

    // Strip internal stacks because they are generally useless
    // with the exception of some stacks containing 'webpack:'. For
    message = message.replace(
        WebpackStacks,
        ''
    );

    return message.trim();
}

export function formatFromJson(json) {
    const errors = json.errors.map(message => formatWebpackMessage(message, true));
    const warnings = json.warnings.map(message => formatWebpackMessage(message, false));
    const results = { errors, warnings };

    if (results.errors.some(isSyntaxError)) {
        // If syntax errors exist, just show those
        results.errors = results.errors.filter(isSyntaxError);
    }
    return results;
}

export default function formatWebpackOutput(stats) {
    const { errors, warnings } = formatFromJson(stats.toJson({}));
    const isSuccessful = !errors.length && !warnings.length;

    if (isSuccessful) {
        console.log(chalk.green('Compiled successfully!'));
    }

    if (errors.length) {
        console.log(chalk.red('Failed to compile!'));
        console.log(errors.join('\n\n'));
        throw new Error(`Failed to compile`);
    }

    if (warnings.length && !errors.length) {
        console.log(chalk.yellow('Compiled with warnings'));
        console.log(warnings.join('\n\n'));
    }

    const compileTime = getCompileTime(stats);
    console.log(chalk.cyan(`Compiled in ${compileTime}ms`));

    return true;
}

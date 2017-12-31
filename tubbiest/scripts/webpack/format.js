import chalk from 'chalk';

const ExportError = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/
const WebpackStacks = /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm
const isSyntaxError = msg => msg.includes('Syntax Error');

const getCompileTime = ({ endTime, startTime }) => endTime - startTime;

function formatWebpackMessage(message, isError) {
    let lines = message.split('\n');
    if (lines.length > 2 && lines[1] === '') {
        lines.splice(1, 1);
    }

    if (lines[0].lastIndexOf('!') !== -1) {
        lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
    }

    lines = lines.filter(line => line.indexOf(' @ ') !== 0);

    if (!lines[0] || !lines[1]) {
        return lines.join('\n');
    }

    if (lines[1].indexOf('Module build failed: ') === 0) {
        lines[1] = lines[1].replace(
            'Module build failed: SyntaxError',
            'SyntaxError'
        );
    }

    if (lines[1].match(ExportError)) {
        lines[1] = lines[1].replace(
            ExportError,
            "$1 '$4' does not contain an export named '$3'."
        );
    }

    message = lines.join('\n');
    message = message.replace(WebpackStacks, '');
    return message.trim();
}

function formatFromJson(json) {
    const errors = json.errors.map(message => formatWebpackMessage(message, true));
    const warnings = json.warnings.map(message => formatWebpackMessage(message, false));
    const results = { errors, warnings };

    if (results.errors.some(isSyntaxError)) {
        results.errors = results.errors.filter(isSyntaxError);
    }
    return results;
}

export default function formatWebpackOutput(stats, target) {
    const { errors, warnings } = formatFromJson(stats.toJson({}));
    const isSuccessful = !errors.length && !warnings.length;

    if (isSuccessful) {
        console.log(chalk.green(`${target} compiled successfully`));
    }

    if (errors.length) {
        console.log(chalk.red(`${target} failed to compile`));
        console.log(errors.join('\n\n'));
        throw new Error(`${target} failed to compile`);
    }

    if (warnings.length && !errors.length) {
        console.log(chalk.yellow(`${target} compiled with warnings`));
        console.log(warnings.join('\n\n'));
    }

    const time = getCompileTime(stats);
    console.log(chalk.cyan(`${target} compiled in ${time}ms`));
    return true;
}



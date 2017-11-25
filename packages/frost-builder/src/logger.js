import chalk from 'chalk';

const infoColor = chalk.rgb(135, 206, 250);
const successColor = chalk.rgb(102, 205, 170);
const warningColor = chalk.rgb(255, 165, 0);

export const Logger = {
    success: msg => successColor(msg),
    info: msg => infoColor(msg),
    warning: msg => warningColor(msg),
    error: msg => chalk.red(msg),
    underline: msg => chalk.underline(msg),
    bold: msg => chalk.bold(msg),
    clearConsole: () => {
        process.stdout.write(
            process.platform === 'win32'
                ? '\x1Bc'
                : '\x1B[2J\x1B[3J\x1B[H'
        );
    }
};

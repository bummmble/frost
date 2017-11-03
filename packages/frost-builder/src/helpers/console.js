import chalk from 'chalk';

const infoColor = chalk.rgb(135, 206, 250); //info
const successColor = chalk.rgb(102, 205, 170); //success
const warningColor = chalk.rgb(255,165, 0); //warning
const errorColor = chalk.red();

const Logger = {
	success: msg => console.log(successColor(msg)),
	info: msg => console.log(infoColor(msg)),
	warning: msg => console.warn(warningColor(msg)),
	error: msg => console.error(errorColor(msg))
};

export default Logger;
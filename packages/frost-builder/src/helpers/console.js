import chalk from 'chalk';

const infoColor = chalk.rgb(135, 206, 250); //info
const successColor = chalk.rgb(102, 205, 170); //success
const warningColor = chalk.rgb(255, 165, 0); //warning
const errorColor = chalk.red();

const Logger = {
  success: msg => successColor(msg),
  info: msg => infoColor(msg),
  warning: msg => warningColor(msg),
  error: msg => errorColor(msg),
  clearConsole: () => {
  	process.stdout.write(
  		process.platform === 'win32'
  			? '\x1Bc'
  			: '\x1B[2J\x1B[3J\x1B[H'
  	);
  }
};

export default Logger;

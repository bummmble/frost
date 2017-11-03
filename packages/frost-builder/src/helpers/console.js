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
};

export default Logger;

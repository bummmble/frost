import notifier from 'node-notifier';
import Logger from './helpers/console';

export default options => {
  const title = `${options.title}`;
  if (options.notify) {
    notifier.notify({
      title,
      message: options.message,
    });
  }

  const level = options.level || 'info';
  const message = `${chalk.bold(title)}: ${options.message}`;

  switch (level) {
    case 'warn':
      console.log(Logger.warning(message));
      break;
    case 'error':
      console.log(Logger.error(message));
      break;
    case 'info':
    default:
      console.log(Logger.info(message));
  }
};

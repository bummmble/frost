import chalk from 'chalk';
import { formatWebpack } from './webpack';

const isMultiStats = stats => stats.stats;
const getCompileTime = stats => {
  if (isMultiStats(stats)) {
    return stats.stats
      .reduce((time, stats) => {
        return Math.max(time, getCompileTime(stats))
      }, 0);
  }
  return stats.endTime - stats.startTime;
};

export default (error, stats, target) => {
  if (error) {
    const msg = `Fatal error while compiling ${target}. Error: ${error}`;
    console.log(chalk.red(msg));
    return Promise.reject(msg);
  }

  const raw = stats.toJson({});
  const { errors, warnings } = formatWebpack(raw);

  const isSuccessful = !errors.length && !warnings.length;
  if (isSuccessful) {
    console.log(chalk.green(`Compiled ${target} successfully`));
  }

  if (errors.length) {
    console.log(chalk.red(`Failed to compile ${target}`));
    console.log(errors.join('\n\n'));
    return Promise.reject(`Failed to compile ${target}`);
  }

  if (warnings.length && !errors.length) {
    console.log(chalk.yellow(`Compiled ${target} with warnings`));
    console.log(warnings.join('\n\n'));
  }

  const compileTime = getCompileTime(stats);
  console.log(chalk.green(`${target} compiled in: ${compileTime}ms`));
  return Promise.resolve(true);
};

import meow from 'meow';
import chalk from 'chalk';
import updateNotifier from 'update-notifier';

import { Root, getConfig } from './config';
import {
  buildClient,
  buildServer,
  cleanClient,
  cleanServer,
} from './commands/build';
import { each } from './helpers/utils';
import Logger from './helpers/console';

const pkg = require('../package.json');
const appPkg = require(Root + '/package.json');
const appInfo = `running on ${Logger.info(appPkg.name)}-${Logger.info(
  appPkg.version,
)}`;

console.log(
  chalk.bold(`Frost ${chalk.magenta(`v ${pkg.version}`)} ${appInfo}`),
);

updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60
}).notify();

const cli = meow(
  `
	Usage:
		$ frost <command>

  Options:
    --verbose, -v       Extensive messages to help with debugging
    --quiet, -q         Silences all but important messages

	Commands:
    build               Builds production versions of both client and server
		build:client        Builds a production version of the client
    build:server        Builds a production version of the server
    clean:              Cleans the output directories
`,
  {
    alias: {
      v: 'verbose',
      q: 'quiet',
    },
  },
);

const input = cli.input;
const flags = cli.flags;
const tasks = [
  {
    task: 'build',
    commands: [cleanClient, cleanServer, buildClient, buildServer],
  },
  { task: 'build:client', commands: [cleanClient, buildClient] },
  { task: 'build:server', commands: [cleanServer, buildServer] },
  { task: 'clean', commands: [cleanServer, cleanClient] },
];

function execute(commands, config) {
  return each(commands, item => item(config));
}
async function executeTasks() {
  const config = await getConfig(flags);
  for (const name of input) {
    for (const task of tasks) {
      if (task.task === name) {
        try {
          await execute(task.commands, config);
        } catch (error) {
          console.error(
            Logger.error(`Failed to execute task ${name}. Error ${error}`),
          );
          console.error(error);
          process.exit(1);
        }
      }
    }
  }
}

if (input.length > 0) {
  process.nextTick(executeTasks);
} else {
  command.showHelp();
}

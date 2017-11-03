import meow from 'meow';
import chalk from 'chalk';
import { getConfig } from './config';
import { buildClient } from './commands/build';
import { each } from './helpers/utils';

const cli = meow(`
	Usage:
		$ frost <command>

	Commands:
		build:client        Builds a production version of the client
`);

const input = cli.input;
const flags = cli.flags;
const tasks = [
	{ task: 'build:client', commands: [buildClient] }
];

function execute(commands, config) {
	return each(commands, (item) => item(config))

}
async function executeTasks() {
	const config = await getConfig(flags);
	for (const name of input) {
		for (const task of tasks) {
			if (task.task === name) {
				try {
					await execute(task.commands, config);
				} catch (error) {
					console.error(chalk.bold.red(`Failed to execute task ${name}. Error ${error}`));
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
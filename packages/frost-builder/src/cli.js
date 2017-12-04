import meow from 'meow'
import chalk from 'chalk'
import updateNotifier from 'update-notifier'
import { loadConfig, Root } from './core/config'
import Frost from './frost';

const pkg = require('../package.json')
const appPkg = require(`${Root }/package.json`)
const appInfo = `running on ${chalk.cyan(appPkg.name)}-${chalk.cyan(appPkg.version)}`;

console.log(
  chalk.bold(`Frost ${chalk.magenta(`v ${pkg.version}`)} ${appInfo}`)
);

updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60,
}).notify()

const cli = meow(
  `
	Usage:
		$ frost <command>

  Options:
    --verbose, -v       Extensive messages to help with debugging
    --quiet, -q         Silences all but important messages

  Commands:
    run
    runOne
    runSequence
`,
  {
    alias: {
      v: 'verbose',
      q: 'quiet',
    },
  }
)

const input = cli.input
const flags = cli.flags

// Prevent deprecation messages
if (!flags.verbose) {
  process.noDeprecation = true
}

async function execute() {
    const { config } = await loadConfig('frost', flags);
    const frost = new Frost(config);
    const { env, command } = flags;
    if (input === 'run') {
        await frost.run(env, command);
    } else if (input === 'runOne') {
        const renderer = flags.renderer;
        await frost.run(env, renderer, command);
    } else if (input === 'sequence') {
        await frost.runSequence(config.sequence);
    }
}

if (input.length > 0) {
  process.nextTick(execute)
} else {
  cli.showHelp()
}

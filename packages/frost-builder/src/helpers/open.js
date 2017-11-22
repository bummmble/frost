import { execSync } from 'child_process';
import spawn from 'cross-spawn';
import opn from 'opn';
import { Logger } from '../logger';

const PossibleActions = Object.freeze({
    None: 0,
    Browser: 1,
    Script: 2
});

function getBrowserEnvironment() {
    const value = process.env.BROWSER;
    let action;

    if (!value) {
        action = PossibleActions.Browser;
    } else if (value.toLowerCase().endsWith('.js')) {
        action = PossibleActions.Script;
    } else if (value.toLowerCase() === 'none') {
        action = PossibleActions.None;
    } else {
        action = PossibleActions.Browser;
    }

    return { action, value };
}

function executeScript(path, url) {
    const child = spawn('node', [path, url], {
        stdio: 'inherit'
    });

    child.on('close', code => {
        if (code !== 0) {
            console.log(Logger.error('The script to open a browser environemnt failed'));
            console.log(Logger.info(`${path} exited with code ${code}`));
            return;
        }
    });

    return true;
}

function executeBrowserProcess(browser, url) {
    try {
        const options = { app: browser };
        opn(url, options).catch(() => {});
        return true;
    } catch (err) {
        return false;
    }
}

export default function openBrowser(url) {
    const { action, value } = getBrowserEnvironment();
    switch (action) {
        case PossibleActions.None:
            return false;
        case PossibleActions.Script:
            return executeScript(value, url);
        case PossibleActions.Browser:
            return executeBrowserProcess(value, url);
        default:
            throw new Error('Cannot open browser like this');
    }
}

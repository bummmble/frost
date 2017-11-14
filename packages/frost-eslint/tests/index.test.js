import test from 'ava';
import eslint from 'eslint';
import tempWrite from 'temp-write';
import frost from '../src/index';

const hasRule = (errors, ruleId) => {
    return errors.some(err => err.ruleId === ruleId);
};

const run = (str, config) => {
    const linter = new eslint.CLIEngine({
        useEslintrc: false,
        configFile: tempWrite.sync(JSON.stringify(config))
    });

    return linter.executeOnText(str).results[0].messages;
};

test('config', t => {
    const errors = run('console.log("test")', frost);
    t.true(hasRule(errors, 'quotes'));
});

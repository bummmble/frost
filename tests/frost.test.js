import test from 'ava';
import { loadConfig } from '../src/core/config';
import Frost from '../src/frost';

test('Should successfully run renderers', async t => {
    const { config } = await loadConfig('frost', {});
    const frost = new Frost(config);
    const result = await frost.run('development', 'client');
    t.true(typeof result === 'object');
});

test('Should successfully run one renderer', async t => {
    const { config } = await loadConfig('frost', {});
    const frost = new Frost(config);
    const result = await frost.runOne('development', 'frost', 'client');
    t.true(typeof result === 'object');
});

test('Should run a sequence of renderers', async t => {
    const { config } = await loadConfig('frost', {});
    const frost = new Frost(config);
    const result = await frost.runSequence([
        { env: 'development', renderer: 'frost', command: 'client' },
        { env: 'production', renderer: 'frost', command: 'client' }
    ]);
    t.true(typeof result === 'object');
});

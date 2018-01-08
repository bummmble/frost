import test from 'ava';
import testConfig from '../../helpers/test.config';
import { getPluginNames } from '../../helpers/compiler';
import ServerCompiler from '../../../src/compilers/server';

// --- Main Compiler ---
// ServerCompiler(env, config)

test('Should generate a valid development server compiler', t => {
    const server = ServerCompiler('development', testConfig);
    const names = getPluginNames(server.plugins);
    t.true(server.entry.main.includes('tests/fixtures/server/index.js'));
    t.true(names.includes('LimitChunkCountPlugin'));
});

test('Should generate a valid production server compiler', t => {
    const server = ServerCompiler('production', testConfig);
    const names = getPluginNames(server.plugins);
    t.true(server.entry.main.includes('tests/fixtures/server/index.js'));
    t.true(names.includes('LimitChunkCountPlugin'));
});

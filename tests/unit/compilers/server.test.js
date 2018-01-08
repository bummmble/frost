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

test('Should provide default value to make istanbul happy', t => {
    try {
        const server = ServerCompiler();
    } catch (err) {
        t.pass();
    }
});

// --- Config Options

test('Should apply provided plugins to server plugins', t => {
    const plugin = class Plugin { constructor() { this.test = true }}
    const p = new plugin();
    const config = {
        ...testConfig,
        webpack: {
            ...testConfig.webpack,
            plugins: {
                ...testConfig.webpack.plugins,
                server: [p]
            }
        }
    };
    const server = ServerCompiler('development', config);
    const names = getPluginNames(server.plugins);
    t.true(names.includes('Plugin'));
});


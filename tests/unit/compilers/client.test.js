import test from 'ava';
import testConfig from '../../helpers/test.config';
import { getPluginNames } from '../../helpers/compiler';
import ClientCompiler from '../../../src/compilers/client';

// --- Main Compiler ---
// ClientCompiler(env, config);
test('Should generate a valid development client compiler', t => {
    const client = ClientCompiler('development', testConfig);
    const names = getPluginNames(client.plugins);
    t.true(client.name === 'client');
    t.true(client.target === 'web');
    t.true(names.includes('CommonsChunkPlugin'));
    t.true(names.includes('HotModuleReplacementPlugin'));
});

test('Should generate a valid production client compiler', t => {
    const client = ClientCompiler('production', testConfig);
    const names = getPluginNames(client.plugins);
    t.true(names.includes('StatsPlugin'));
});

test('Test for defaults to make istanbul happy', t => {
    try {
        const client = ClientCompiler();
    } catch (err) {
        t.pass();
    }
});

// --- Config Options

test('Should add babili compression', t => {
    const config = {
        ...testConfig,
        compression: {
            ...testConfig.compression,
            kind: 'babili'
        }
    };
    const client = ClientCompiler('production', config);
    const names = getPluginNames(client.plugins);
    t.true(names.includes('BabelMinifyPlugin'));
});

test('Should add uglify compression', t => {
    const config = {
        ...testConfig,
        compression: {
            ...testConfig.compression,
            kind: 'uglify'
        }
    };
    const client = ClientCompiler('production', config);
    const names = getPluginNames(client.plugins);
    t.true(names.includes('UglifyJsPlugin'));
});

test('Should add service worker plugin for pwa', t => {
    const config = {
        ...testConfig,
        pwa: {
            ...testConfig.pwa,
            hasServiceWorker: true,
            workerEntry: 'tests/fixtures/client/sw.js'
        }
    };
    const client = ClientCompiler('development', config);
    const names = getPluginNames(client.plugins);
    t.true(names.includes('ServiceWorkerPlugin'));
});

test('should extract text', t => {
    const config = {
        ...testConfig,
        styles: {
            ...testConfig.styles,
            cssLoader: true,
            extract: 'text'
        }
    };
    const client = ClientCompiler('development', config);
    const names = getPluginNames(client.plugins);
    t.true(names.includes('ExtractTextPlugin'));
});

test('Should extract chunks', t => {
    const config = {
        ...testConfig,
        styles: {
            ...testConfig.styles,
            cssLoader: true,
            extract: 'chunks'
        }
    };
    const client = ClientCompiler('development', config);
    const names = getPluginNames(client.plugins);
    // This has the same name due to the function
    // that generates the plugin. These are verifiably
    // different when logging the plugin itself
    t.true(names.includes('ExtractTextPlugin'));
});

test('Should create vendor chunks when vendor entries are present', t => {
    const config = {
        ...testConfig,
        entry: {
            ...testConfig.entry,
            vendor: ['react']
        }
    };
    const client = ClientCompiler('development', config);
    const names = getPluginNames(client.plugins);

    let chunksCount = 0;
    names.forEach(name => {
        if (name === 'CommonsChunkPlugin') {
            chunksCount++;
        }
    });
    t.true(chunksCount === 3);
});

test('Should add provided plugins to compiler', t => {
    const plugin = class Plugin { constructor() { this.test = true }}
    const p = new plugin();
    const config = {
        ...testConfig,
        webpack: {
            ...testConfig.webpack,
            plugins: {
                ...testConfig.webpack.plugins,
                client: [p]
            }
        }
    };
    const client = ClientCompiler('development', config);
    const names = getPluginNames(client.plugins);
    t.true(names.includes('Plugin'));
});

test('Should add client externals when using rust', t => {
    const config = {
        ...testConfig,
        useRust: true
    };
    const client = ClientCompiler('development', config);
    t.true(client.externals['fs']);
    t.true(client.externals['path']);
});

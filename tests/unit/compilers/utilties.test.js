import test from 'ava';
import { configurePerformance, configureDevtool, configureEntry, configureOutput } from '../../../src/compilers/helpers';
import testConfig from '../../helpers/test.config';

// --- Performance ---
// configurePerformance(isDev, isServer, config)

test('Should return false is performance option is false', t => {
    const performance = configurePerformance(false, false, testConfig);
    t.true(performance === false);
});

test('Should evaluate performance option if is object', t => {
    const config = {
        ...testConfig,
        webpack: { ... testConfig.webpack, performance: { hints: 'warning' } }
    };
    const performance = configurePerformance(false, false, config);
    t.true(typeof performance === 'object');
});

test('Should evaluate performance if passed a function', t => {
    const config = {
        ...testConfig,
        webpack: {
            ...testConfig.webpack,
            performance: function(isDev, isServer) {
                return {
                    maxAssetSize: isServer ? 50 : false,
                    hints: isDev ? 'warning' : false
                }
            }
        }
    };

    const performance = configurePerformance(true, true, config);
    t.true(performance.maxAssetSize == 50);
    t.true(performance.hints == 'warning');
});


// --- Devtool ---
// configureDevtool(isProd, config)

test('Should create appropriate sourcemaps for a true option in any environment', t => {
    const config = {
        ...testConfig,
        sourceMaps: true
    };
    const dev = configureDevtool(false, config);
    const prod = configureDevtool(true, config);
    t.true(dev == 'eval');
    t.true(prod == 'source-map');
});

test('Should return false if sourceMaps is false', t => {
    const config = {
        ...testConfig,
        sourceMaps: false
    };
    const tool = configureDevtool(false, config);
    t.true(tool === false);
});

test('Should directly apply devtool is sourcemaps is a string', t => {
    const config = {
        ...testConfig,
        sourceMaps: 'cheap-eval-source-map'
    };
    const tool = configureDevtool(false, config);
    t.true(tool == 'cheap-eval-source-map');
});

test('If babili compression is enabled then devtool should be changed', t => {
    const config = {
        ...testConfig,
        sourceMaps: true,
        compression: {
            ...testConfig.compression,
            kind: 'babili'
        }
    };
    const tool = configureDevtool(false, config);
    t.true(tool == 'cheap-source-map');
});

test('If typesript is enabled then devtool should be changed', t => {
    const config = {
        ...testConfig,
        sourceMaps: true,
        useTypescript: true
    };
    const tool = configureDevtool(false, config);
    t.true(tool == 'inline-source-map');
});

// --- Destinations ---
// configureEntry(isDev, isServer, config)
// configureOutput(isDev, isServer, config)

test('Should return the proper entry for server and client', t => {
    const client = configureEntry(false, false, testConfig);
    const server = configureEntry(false, true, testConfig);
    t.true(client.main.includes(testConfig.entry.client));
    t.true(server.main.includes(testConfig.entry.server));
});

test('Should add hmr and react-hot-loader to entry', t => {
    const config = {
        ...testConfig,
        webpack: {
            ...testConfig.webpack,
            useHmr: true
        },
        framework: {
            ...testConfig.framework,
            name: 'react',
        }
    };
    const entry = configureEntry(true, false, config);
    t.true(entry.main.includes('react-hot-loader'));
    t.true(entry.main.includes('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo-false'));
});

test('Should configure proper output for dev and server', t => {
    const output = configureOutput(true, true, testConfig);
    t.true(output.libraryTarget == 'commonjs2');
    t.true(output.filename == '[name].js');
    t.true(output.chunkFilename == '[name].js');
    t.true(output.pathinfo === true);
    t.true(output.path == testConfig.output.server);
});

test('Should handle production options for output', t => {
    const output = configureOutput(false, false, testConfig);
    t.true(output.filename == '[name].[chunkhash].js');
    t.true(output.chunkFilename == '[name].[chunkhash].js');
});


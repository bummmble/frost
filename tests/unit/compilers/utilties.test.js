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

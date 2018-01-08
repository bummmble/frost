import test from 'ava';
import testConfig from '../../helpers/test.config';
import loadStyles, {
    generateCssLoader,
    generatePostcssLoader,
    generateSassLoader,
    generateScssLoader,
    generateLessLoader,
    generateStylusLoader,
    preprocessorMap
} from '../../../src/compilers/helpers/styles';

// --- Main Style Loader ---
// loadStyles(isDev, isServer, config)
test('Should generate a collection of loaders', t => {
    const config = {
        ...testConfig,
        styles: {
            ...testConfig.styles,
            cssLoader: true,
            postcss: true,
            preprocessor: 'sass'
        }
    };
    const loaders = loadStyles(false, false, config);
    t.true(loaders.length == 3);
    t.true(loaders[0].loader === 'css-loader');
    t.true(loaders[1].loader === 'postcss-loader');
    t.true(loaders[2].loader === 'sass-loader');
});

test('Should return an instance of extract-text when extract is set to text', t => {
    const config = {
        ...testConfig,
        styles: {
            ...testConfig.styles,
            extract: 'text'
        }
    };
    const loaders = loadStyles(false, false, config);
    const split = loaders[0].loader.split('node_modules')[1];
    t.true(split === '/extract-text-webpack-plugin/dist/loader.js');
});

test('Should return an instance of extreact-css-chunks when extract is set to chunks', t => {
    const config = {
        ...testConfig,
        styles: {
            ...testConfig.styles,
            extract: 'chunks'
        }
    };
    const loaders = loadStyles(false, false, config);
    const split = loaders[0].loader.split('node_modules')[1];
    t.true(split === '/extract-css-chunks-webpack-plugin/loader.js');
});

// --- Css Loader ---
// generateCssLoader(isDev, isServer, config)

test('Should apply config options to the css loader if provided', t => {
    const styles = {
        postcss: true,
        cssLoader: {
            sourceMaps: true
        }
    };

    const loader = generateCssLoader(true, false, styles).options;
    t.true(loader.sourceMaps === true);
    t.true(loader.minimize === false);
});

test('Should return the proper loader for client and server', t => {
    const client = generateCssLoader(true, false, testConfig.styles);
    const server = generateCssLoader(true, true, testConfig.styles);
    t.true(client.loader == 'css-loader');
    t.true(server.loader == 'css-loader/locals');
});


// --- Other Loaders --- //
// generatePostcssLoader(config)

test('Should return a basic config', t => {
    const styles = {
        postcss: true
    };
    const postcss = generatePostcssLoader(styles);
    t.true(postcss.loader == 'postcss-loader');
});

test('Should apply config options to postcss loader', t => {
    const styles = {
        postcss: {
            sourceMaps: true
        }
    };
    const postcss = generatePostcssLoader(styles);
    t.true(postcss.options.sourceMaps === true);
});

test('Should generate loaders for sass, scss, less, and stylus', t => {
    const sass = generateSassLoader();
    const scss = generateScssLoader();
    const less = generateLessLoader();
    const stylus = generateStylusLoader();

    t.true(sass.loader === 'sass-loader');
    t.true(sass.options.indentedSyntax === true);
    t.true(scss.loader === 'sass-loader');
    t.true(less.loader === 'less-loader');
    t.true(stylus.loader === 'stylus-loader');
});


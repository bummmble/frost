module.exports = {
    entry: {
        client: 'tests/fixtures/client/index.js',
        server: 'tests/fixtures/server/index.js',
        vendor: []
    },
    output: {
        client: 'test/fixtures/build/client',
        server: 'test/fixtures/build/server',
        publicPath: '/static/'
    },
    files: {
        babel: /\.(js|mjs|jsx)$/,
        styles: /\.(css|sss|pcss|sass|scss|less|styl|stylus)$/,
        typescript: /\.(ts|tsx)$/,
        elm: /\.elm$/,
        rust: /\.rs$/,
        graphql: /\.(graphql|gql)$/,
        video: /\.(mp4|webm)$/,
        images: /\.(jpg|jpeg|gif|svg|png|webp)$/,
        fonts: /\.(eot|otf|ttf|woff|woff2)$/
    },
    styles: {
        postcss: false,
        cssLoader: false,
        preprocessor: 'none',
        extract: 'none',
        extractOptions: {}
    },
    babelOptions: {},
    compression: {
        kind: 'none',
        babiliClientOptions: {},
        babiliServerOptions: {},
        uglifyOptions: {}
    },
    serverOptions: {
        useHttps: false,
        keyPath: 'test/fixtures/localhost.key',
        certPath: 'test/fixtures/localhost.cert'
    },
    sourceMaps: false,
    pwa: {
        hasServiceWorker: false,
        workerEntry: 'test/fixtures/client/sw.js'
    },
    useRust: false,
    useElm: false,
    useTypescript: false,
    verbose: false,
    quiet: false,
    webpack: {
        useHappypack: false,
        useHmr: true,
        performance: false,
        plugins: {
            client: [],
            server: []
        }
    },
    framework: {
        name: 'none',
        react: {
            useHotLoader: true
        },
        vue: {
            useVueLoader: true,
            useSSR: true
        }
    },
    renderers: []
}

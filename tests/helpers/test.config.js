module.exports = {
    entry: {
        client: 'test/fixtures/client/index.js',
        server: 'test/fixtures/server/index.js',
        vendor: []
    },
    output: {
        client: 'test/fixtures/build/client',
        server: 'test/fixtures/build/server',
        publicPath: '/static/'
    }
}

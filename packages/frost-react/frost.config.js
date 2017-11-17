const config = {
    entry: {
        server: 'src/server/index.js',
        client: 'src/client/index.js',
    },

    output: {
        server: 'build/server',
        client: 'build/client',
        public: '/static/'
    },

    hook: {}
};

module.exports = config;

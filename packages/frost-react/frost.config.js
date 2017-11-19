const config = {
    entry: {
        server: 'src/server/render.js',
        client: 'src/client/index.js',
    },

    output: {
        server: 'build/server',
        client: 'build/client',
        public: '/static/'
    },

    postcss: false,
    hook: {}
};

module.exports = config;

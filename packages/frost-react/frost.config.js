const config = {
    entry: {
        server: 'src/server/index',
        client: 'src/client/index',
    },

    output: {
        server: 'build/server',
        client: 'build/client',
        public: '/static/'
    },

    hook: {}
};

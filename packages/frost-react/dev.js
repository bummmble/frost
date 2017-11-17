const dotenv = require('dotenv');
const { createExpressServer } = require('frost-express');
const { getConfig } = require('frost-shared');
const { create, connect } = require('frost-builder');

dotenv.config();

async function main() {
    const config = await getConfig({});
    const { middleware, multiCompiler } = create(config);
    const server = createExpressServer({
        staticConfig: {
            public: config.output.public,
            path: config.output.client
        },
        afterSecurity: [],
        beforeFallback: [...middleware],
        enableNonce: process.env.ENABLE_NONCE
    });

    connect(server, multiCompiler);
}

process.nextTick(main);

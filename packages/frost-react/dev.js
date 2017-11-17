import dotenv from 'dotenv';
import { createExpressServer } from 'frost-express';
import { getConfig } from 'frost-shared';
import { create, connect } from 'frost-builder';

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

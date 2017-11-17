import { resolve } from 'path';
import dotenv from 'dotenv';

import { createExpressServer } from 'frost-server';
import { getConfig } from 'frost-shared';

dotenv.config();

async function main() {
    const config = await getConfig({});
    const clientStats = require(resolve(config.output.client, 'stats.json'));
    const serverRender = require(resolve(config.output.server, 'main.js')).default;
    const server = createExpressServer({
        staticConfig: {
            public: config.output.public,
            path: config.output.client
        },
        afterSecurity: [],
        beforeFallback: [
            serverRender({
                clientStats
            })
        ],
        enableNonce: process.env.ENABLE_NONCE
    });

    server.listen(process.env.SERVER_PORT, () => {
        console.log(`Prod Server started at port: ${process.env.SERVER_PORT}`);
    })
}

process.nextTick(main);

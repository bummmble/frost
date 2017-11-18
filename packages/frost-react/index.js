const { resolve } = require('path');
const dotenv = require('dotenv');
const { createExpressServer } = require('frost-express');
const { getConfig } = require('frost-shared');

dotenv.config();

async function main() {
    const config = await getConfig({verbose: false});
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
        console.log(`Server started at Port: ${process.env.SERVER_PORT}`);
    });
}

process.nextTick(main);

import { Server } from 'http';
import { resolve } from 'path';
import dotenv from 'dotenv';
import createExpress from './src/server';

dotenv.config();

function main() {
    const clientStats = require(resolve(__dirname, 'build/client/stats.json'));
    const serverRender = require(resolve(__dirname, 'build/server/main.js')).default;

    const express = createExpress();
    express.use(serverRender({
        clientStats
    }));
    const server = new Server(express);
    server.listen(8000, () => console.log('server listening'));
}

main();

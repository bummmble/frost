const dotenv = require('dotenv');
const { createExpressServer } = require('frost-express');
const { getConfig } = require('frost-shared');
const { create, connect, start } = require('frost-builder');

dotenv.config();

async function main() {
    const config = await getConfig({});
    console.log(config);
}

process.nextTick(main);

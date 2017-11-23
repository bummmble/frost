import { readFileSync, existsSync } from 'fs-extra';

export default function getCerts({ serverOptions }) {
    let key;
    let cert;

    if (existsSync(serverOptions.key) && existsSync(serverOptions.cert)) {
        key = readFileSync(serverOptions.key);
        cert = readFileSync(serverOptions.cert);
        return { key, cert };
    } else {
        throw new Error('No SSL certs found');
    }
}

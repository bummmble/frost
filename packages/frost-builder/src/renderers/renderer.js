import getPort from 'get-port';
import http from 'http';
import { createExpressServer } from 'frost-express';
import Builder from '../core/builder';

export default class Renderer {
    constructor(config) {
        this.config = config;
        this.builder = new Builder();
    }

    getProps(env, target) {
        return {
            isDev: env === 'development',
            isProd: env === 'production',
            isClient: target === 'client',
            isServer: target === 'server',
            webpackTarget: target === 'client' ? 'web' : 'node'
        };
    }

    async listen(server, middleware) {
        let Server;

        if (!server) {
            server = createExpressServer({
                afterSecurity: [],
                beforeFallback: middleware ? [...middleware] : [],
                enableNonce: false
            });
        }

        const serverOptions = this.config.serverOptions;
        const isHttps = serverOptions.useHttps ? true : false;
        const protocol = isHttps ? 'https' : 'http';

        if (isHttps) {

        } else {
            Server = http.createServer(server);
        }

        const port = await getPort({ port: 8000 });
        Server.listen(port, () => {
            console.log(`Frost is listening to a server on Port: ${port}`);
        });
    }
}

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import Renderer from './renderer';
import ClientCompiler from '../compilers/client';
import ServerCompiler from '../compilers/server';

const CommandMap = {
    'client': 'renderClient',
    'server': 'renderServer',
    'universal': 'renderUniversal',
    'dev': 'devServer'
};

export default class FrostRenderer extends Renderer {
    constructor(config) {
        super(config);
        this.name = 'frost';
    }

    async build(env, command) {
        await this[CommandMap[command]](env);
        return this;
    }

    async renderClient(env) {
        const compiler = this.createClientCompiler(env);
        await this.builder.build([compiler], env);
        return this;
    }

    async renderServer(env) {
        const compiler = this.createServerCompiler(env);
        await this.builder.build([compiler], env);
        return this;
    }

    async renderUniversal(env) {
        await this.builder.build(this.createMultiCompiler(env), env);
        return this;
    }

    async devServer() {
        const output = this.config.output;
        const multiCompiler = webpack(this.createMultiCompiler('development'));
        const client = multiCompiler.compilers[0];

        const devMiddleware = webpackDevMiddleware(multiCompiler, {
            publicPath: output.public,
            quiet: true,
            noInfo: true
        });
        const hotMiddleware = webpackHotMiddleware(client);
        const hotSeverMiddleware = webpackHotServerMiddleware(multiCompiler, {
            serverRendererOptions: {
                outputPath: output.client
            }
        });

        const middleware = [devMiddleware, hotMiddleware, hotSeverMiddleware];
        await this.builder.startDev(multiCompiler);
        this.listen(null, middleware);
        return this;
    }

    createClientCompiler(env) {
        const props = this.getProps(env, 'client');
        const compiler = ClientCompiler(props, this.config);
        return compiler;
    }

    createServerCompiler(env) {
        const props = this.getProps(env, 'server');
        const compiler = ServerCompiler(props, this.config);
        return compiler;
    }

    createMultiCompiler(env) {
        const multiCompiler = [this.createClientCompiler(env), this.createServerCompiler(env)];
        return multiCompiler;
    }
}

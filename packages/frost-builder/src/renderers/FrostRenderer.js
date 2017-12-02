import webpack from 'webpack';
import Renderer from './renderer';
import ClientCompiler from '../compilers/client';
import ServerCompiler from '../compilers/server';

const CommandMap = {
    'client': 'renderClient',
    'server': 'renderServer',
    'universal': 'renderUniversal'
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
        await this.builder.build(this.createClientCompiler(env), env);
        return this;
    }

    async renderServer(env) {
        await this.builder.build(this.createServerCompiler(env), env);
        return this;
    }

    async renderUniversal(env) {
        await this.builder.build(this.createMultiCompiler(env), env);
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
        const multiCompiler = [createClientCompiler(env), createServerCompiler(env)];
        return compilers;
    }
}

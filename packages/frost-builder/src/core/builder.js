import webpack from 'webpack';
import { each } from 'frost-utils';
import { emitEvent } from './emitter';
import formatWebpackOutput from '../compilers/helpers/formatting';

const Status = {
    Initializing: 0,
    Building: 1,
    Finished: 2
};

function webpackPromise(compiler) {
    emitEvent(`before-webpack-${compiler.options.name}-compilation`);
    return new Promise((resolve, reject) => {
        compiler.plugin('done', stats => {
            emitEvent('after-webpack-compilation', stats);
            resolve(stats);
        });

        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }
        });
    });
}

export default class Builder {
    constructor() {
        this.compilers = [];
        this.status = Status.Initializing;
    }

    async build(compilers, env, target) {
        if (this.status === Status.Finished && env === 'development') {
            // Only run dev build once
            return this;
        }
        this.status = Status.Building;
        emitEvent('before-webpack-build', compilers);

        await this.buildWebpack(compilers, env, target);

        this.status = Status.Finished;
        emitEvent('after-webpack-build');

        return this;
    }

    async buildWebpack(compilers, env, target) {
        const cache = {};

        this.compilers = compilers.map(config => {
            const compiler = webpack(config);
            compiler.cache = cache;
            return compiler;
        });

        await each(this.compilers,  async compiler => {
            target ? compiler.options.name : target + compiler.options.name;
            const stats = await webpackPromise(compiler);
            formatWebpackOutput(stats, target);
        });

        return true;
    }

    startDev(multiCompiler, target = '') {
        emitEvent('before-dev-server-start', multiCompiler);
        return new Promise((resolve, reject) => {
            multiCompiler.plugin('invalid', () => {
                console.log(target + 'Dev Server Compiling');
            });

            multiCompiler.plugin('done', stats => {
                emitEvent('after-dev-server-build', stats);
                return resolve(stats);
            });
        });
    }
}

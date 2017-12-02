import webpack from 'webpack';
import { each } from 'frost-utils';
import { emitEvent } from './emitter';

export default class Builder {
    constructor() {
        this.compilers = [];
    }

    async build(compilers, env) {
        emitEvent('before-webpack-build', compilers);

        await this.buildWebpack(compilers, env);

        emitEvent('after-webpack-build');

        return this;
    }

    async buildWebpack(compilers, env) {
        const cache = {};

        this.compilers = compilers.map(config => {
            const compiler = webpack(config);
            compiler.cache = cache;
            return compiler;
        });

        await each(this.compilers, compiler => {
            emitEvent(`before-webpack-${compiler.options.name}-compilation`);
            return new Promise((resolve, reject) => {
                compiler.plugin('done', stats => {
                    emitEvent('after-webpack-compilation', stats);
                    process.nextTick(resolve);
                });

                compiler.run((err, stats) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }

                    if (stats.hasErrors()) {
                        return reject(new Error('Webpack build failed'));
                    }
                })
            })
        })

        return true;
    }

    startDev(multiCompiler) {
        emitEvent('before-dev-server-start', multiCompiler);
        return new Promise((resolve, reject) => {
            multiCompiler.plugin('invalid', () => {
                console.log('Dev Server Compiling');
            });

            multiCompiler.plugin('done', stats => {
                emitEvent('after-dev-server-build', stats);
                return resolve(stats);
            });
        });
    }
}

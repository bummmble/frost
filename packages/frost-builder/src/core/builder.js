import webpack from 'webpack';
import { each } from 'frost-utils';

export default class Builder {
    constructor() {
        this.compilers = [];
    }

    async build(compilers, env) {
        await this.buildWebpack(compilers, env);
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
            return new Promise((resolve, reject) => {
                compiler.plugin('done', stats => {
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
        return new Promise((resolve, reject) => {
            multiCompiler.plugin('invalid', () => {
                console.log('Dev Server Compiling');
            });

            multiCompiler.plugin('done', stats => {
                return resolve(stats);
            });
        });
    }
}

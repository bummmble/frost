export default class MissingModules {
    constructor(path) {
        this.path = path;
    }

    apply(compiler) {
        compiler.plugin('emit', (compilation, cb) => {
            const path = this.path;
            const missing = compilation.missingDependencies;
            if (missing.some(file => !file.includes(path))) {
                compilation.contextDependencies.push(path);
            }

            cb();
        });
    }
}

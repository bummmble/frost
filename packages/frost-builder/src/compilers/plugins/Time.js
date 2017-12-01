export default class Time {
    constructor(fix = 11000) {
        this.fix = fix;
    }

    apply(compiler) {
        compiler.plugin('watch-run', (watching, cb) => {
            watching.startTime += this.fix;
            cb();
        });

        compiler.plugin('done', stats => {
            stats.startTime -= this.fix;
        });
    }
}

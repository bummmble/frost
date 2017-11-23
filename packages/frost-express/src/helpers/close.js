import { promisify } from 'frost-utils';
import stopAgenda from 'stop-agenda';

export default class GracefulClose {
    constructor(config) {
        this.config = Object.assign({
            server: false,
            redis: false,
            mongoose: false,
            agenda: false,
            timeout: 5000,
            stopAgenda: {}
        }, config);

        this._exists = false;
    }

    listen() {
        process.on('message', msg => {
            if (msg === 'shutdown') {
                this.exit();
            }
        });

        process.on('SIGTERM', () => this.exit());
        process.on('SIGHUP', () => this.exit());
        process.on('SIGINT', () => this.exit());
    }

    exit() {
        const { server, redis, mongoose, agenda, timeout } = this.config;
        if (this._exists) {
            console.log('Already trying to gracefully close connections');
            return;
        }

        this._exists = true;

        const promises = [];

        if (server) {
            promises.push(promisify(server.close).bind(server));
        }

        if (redis) {
            promises.push(promisify(redis.quit).bind(redis));
        }

        if (mongoose) {
            // we need to cancel any recurring agenda jobs
            // before shutting down mongo
            if (agenda) {
                promises.push(new Promise(async (resolve, reject) => {
                    try {
                        try {
                            await stopAgenda(agenda, this.config.stopAgenda);
                        } catch (err) {
                            console.error(err);
                        } finally {
                            await mongoose.disconnect();
                            resolve();
                        }
                    } catch (err) {
                        reject(err);
                    }
                }));
            } else {
                promises.push(mongoose.disconnect);
            }
        } else if (agenda) {
            promises.push(stopAgenda(agenda, this.config.stopAgenda));
        }

        setTimeout(() => {
            console.error(new Error(`Graceful close failed, timeout of ${timeout}ms exceeded`));
            process.exit(1);
        }, timeout);

        Promise.all(promises)
            .then(() => {
                console.log('Gracefully closed connections');
                process.exit(1);
            })
            .catch(err => {
                console.error(err);
                process.exit(1);
            })
    }
}

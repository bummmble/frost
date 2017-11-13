import mongoose from 'mongoose';
import delay from 'delay';

export default class Mongoose {
    constructor(config = {}) {
        this.config = Object.assign({
            agenda: false,
            reconnectTime: 3000,
            Promise: global.Promise,
            logger: console,
            mongo: {}
        }, config);

        this.logger = this.config.logger;
        this.agenda = this.config.agenda;
        this.config.mongo = Object.assign({
            url: 'mongodb://localhost:27017/test',
            options: {}
        }, this.config.mongo);
        this.config.mongo.options = Object.assign({
            useMongoClient: true,
            reconnectTries: Number.MAX_VALUE
        }, this.config.mongo.options);

        // set Promise
        mongoose.Promise = this.config.Promise;

        // when is connected
        mongoose.connection.on('connected', this.connected.bind(this));
        mongoose.connection.on('error', this.logger.error);
        mongoose.connection.on('disconnected', this.disconnected.bind(this));

        // TODO: Handle job scheduling

        this.reconnect().then();
        this.mongoose = mongoose;
    }

    async reconnect() {
        try {
            await mongoose.connect(
                this.config.mongo.url,
                this.config.mongo.options
            );
        } catch (err) {
            this.logger.error(err);
            await delay(this.config.reconnectTime);
            await this.reconnect();
        }
    }

    connected() {
        this.logger.log(`mongoose connection open to ${this.config.mongo.url}`);
    }

    disconnected() {
        this.logger.log('mongoose disconnected');
    }
}

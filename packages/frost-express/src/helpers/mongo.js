import mongoose from 'mongoose';
import delay from 'delay';

export default class Mongoose {
    constructor(config = {}) {
        this.config = Object.assign({
            agenda: false,
            agendaCollectionName: 'agendaTasks',
            agendaRecurringTasks: [],
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

        // If we have an agenda instance, make sure it is valid
        if (this.agenda) {
            if (typeof this.config.agendaCollectionName !== 'string') {
                throw new Error('Agenda collection name should be a string');
            }

            if (!Array.isArray(this.config.agendaRecurringTasks)) {
                throw new Error('Agenda recurring tasks should be an array');
            }

            this.agendaMaxConcurrency = this.agenda._maxConcurrency;
        }

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
        // We need to override the default connection event, because
        // agenda requires us to in order to connect to the same mongoose
        // connection
        if (!this.agenda) {
            return;
        }

        this.agenda.mongo(
            mongoose.connection.collection(this.config.agendaCollectionName).conn.db,
            this.config.agendaCollectionName,
            err => {
                if (err) {
                    return this.logger.error(err);
                }

                // Redefine recurring jobs here to be
                // inside of agenda.mongo otherwise
                // this._collection is not defined yet
                if (this.config.agendaRecurringTasks.length > 0) {
                    this.config.agendaRecurringTasks.forEach(task => {
                        if (!Array.isArray(task)) {
                            throw new Error('Recurring task was not an array');
                        }
                        if (typeof task[0] !== 'string') {
                            throw new Error('Recurring task interval must be a string')
                        }
                        if (typeof task[1] !== 'string') {
                            throw new Error('Recurring task name must be a string');
                        }

                        this.agenda.every.apply(this.agenda, task);
                    });
                }

                // start accepting jobs
                this.agenda.maxConcurrency(this.agendaMaxConcurrency);
                logger.log('agenda opened using existing mongoose connection');
            }
        )
    }

    disconnected() {
        this.logger.log('mongoose disconnected');
    }
}

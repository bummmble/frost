import { each } from 'frost-utils';
import FrostRenderer from './renderers/FrostRenderer';
import { emitEvent } from './core/emitter';


export default class Frost {
    constructor(config, renderers) {
        this.config = config;
        // Allow this to be extendable later
        this.renderers = { 'frost': new FrostRenderer(this.config) };
    }

    async run(env, command) {
        emitEvent('beforeRun', command);

        const keys = Object.keys(this.renderers);
        try {
            await each(keys, async key => {
                const renderer = this.renderers[key];
                await renderer.build(env, command);
            });
        } catch (err) {
            throw new Error(err);
        }

        return this;
    }

    async runOne(env, renderer, command) {
        emitEvent('beforeRunOne', renderer, command);
        await this.renderers[renderer].build(env, command);
        return this;
    }

    async runSequence(sequence) {
        emitEvent('beforeSequence', sequence);
        await each(sequence, async item => {
            const { env, renderer, command } = item;
            await this.renderers[renderer].build(env, command);
        });
        return this;
    }
}

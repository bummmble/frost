import { each } from 'frost-utils';
import { resolve } from 'path';
import FrostRenderer from './renderers/FrostRenderer';
import { emitEvent } from './core/emitter';


export default class Frost {
    constructor(config, renderers = []) {
        this.config = config;
        // Allow this to be extendable later
        this.renderers = this.prepareRenderers(renderers);
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

    prepareRenderers(renderers) {
        if (!renderers.length > 0 && !this.config.renderers) {
            return {
                frost: new FrostRenderer(this.config)
            };
        }

        if (this.config.renderers && this.config.renderers.length > 0) {
            renderers = renderers.concat(this.config.renderers);
        }

        return renderers.map(renderer => {
            if (renderer.charAt(0) === '.') {
                return require(resolve(config.root, renderer));
            } else {
                return require.resolve(renderer);
            }
        });
    }
}

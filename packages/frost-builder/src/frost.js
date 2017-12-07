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
        console.log(this.renderers);
        const keys = this.renderers.keys();
        try {
            await each(keys, async key => {
                const renderer = this.renderers.get(key);
                await renderer.build(env, command);
            });
        } catch (err) {
            throw new Error(err);
        }

        return this;
    }

    async runOne(env, renderer, command) {
        emitEvent('beforeRunOne', renderer, command);
        await this.renderers.get(renderer).build(env, command);
        return this;
    }

    async runSequence(sequence) {
        emitEvent('beforeSequence', sequence);
        await each(sequence, async item => {
            const { env, renderer, command } = item;
            await this.renderers.get(renderer).build(env, command);
        });

        return this;
    }

    prepareRenderers(renderers) {
        const Renderers = new Map();

        if (!renderers.length > 0 && !this.config.renderers) {
            Renderers.set('frost', new FrostRenderer(this.config));
        }

        if (this.config.renderers && this.config.renderers.length > 0) {
            renderers = renderers.concat(this.config.renderers);
        }

        renderers.forEach(renderer => {
            if (renderer.charAt(0) === '.') {
                const r = require(resolve(config.root, renderer));
                const name = renderer.slice(renderer.lastIndexOf('/'), renderer.length);
                const instance = new r(this.config);
                Renderers.set(name, instance);
            } else if (renderer === 'frost') {
                const instance = new FrostRenderer(this.config);
                Renderers.set('frost', instance);
            } else {
                const r = require.resolve(renderer);
                const instance = new r(this.config);
                Renderers.set(renderer, instance);
            }
        });

        return Renderers;
    }
}

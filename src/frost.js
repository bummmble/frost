import { each } from 'frost-utils';
import { resolve } from 'path';
import FrostRenderer from './renderers/FrostRenderer';
import { emitEvent } from './core/emitter';


export default class Frost {
    constructor(config, renderers = []) {
        this.config = config;
        this.renderers = this.prepareRenderers(renderers);
    }

    async run(env, command) {
        emitEvent('beforeRun', command);
        const keys = Array.from(this.renderers.keys());
        try {
            await each(keys, async key => {
                await this.renderers.get(key).build(env, command);
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
        // If there are no renderers set, apply the default Frost renderer
        // and return
        if (!renderers.length > 0 && !this.config.renderers.length > 0) {
            Renderers.set('frost', new FrostRenderer(this.config));
            return Renderers;
        }
        if (this.config.renderers.length > 0) {
            renderers = [
                ...renderers,
                ...this.config.renderers
            ];
        }

        renderers.forEach(renderer => {
            // Resolve local renderers
            if (renderer.charAt(0) === '.') {
                const path = resolve(this.config.root, renderer);
                const name = path.slice(path.lastIndexOf('/'), path.length);
                const r = require(path);
                Renderers.set(name, new r(this.config));
            } else if (renderer === 'frost') {
                Renderers.set('frost', new FrostRenderer(this.config));
            } else {
                // Resolve renderer from node_modules
                const r = require.resolve(renderer);
                Renderers.set(renderer, new r(this.config));
            }
        });

        return Renderers;
    }
}

import test from 'ava';
import { loadConfig } from '../src/core/config';
import Renderer from '../src/renderers/renderer';
import FrostRenderer from '../src/renderers/FrostRenderer';

test('It should correctly get props from target and env', async t => {
    const { config } = await loadConfig('frost', {});
    const renderer = new Renderer(config);
    const props = renderer.getProps('development', 'client');
    t.true(props.isDev === true);
    t.true(props.isProd === false);
    t.true(props.isClient === true);
    t.true(props.isServer === false);
    t.true(props.webpackTarget === 'web');
});

test('Frost Renderer should render client', async t => {
    const { config } = await loadConfig('frost', {});
    const renderer = new FrostRenderer(config);
    const result = await renderer.renderClient('development');
    t.true(typeof result === 'object');
});

test('Frost Renderer should render server', async t => {
    const { config } = await loadConfig('frost', {});
    const renderer = new FrostRenderer(config);
    const result = await renderer.renderServer('development');
    t.true(typeof result === 'object');
});

test('Frost Renderer should render a universal build', async t => {
    const { config } = await loadConfig('frost', {});
    const renderer = new FrostRenderer(config);
    const result = await renderer.renderUniversal('development');
    t.true(typeof result === 'object');
});

test('Frost Renderer should try to start a dev server', async t => {
    const { config } = await loadConfig('frost', {});
    const renderer = new FrostRenderer(config);
    const result = await renderer.devServer();
    t.true(typeof result === 'object');
});

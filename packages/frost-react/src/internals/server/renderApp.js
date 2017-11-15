import ReactDom from 'react-dom/server';
import flushChunks from 'webpack-flush-chunks';
import { NOT_FOUND } from 'redux-first-router';
import { flushChunkNames } from 'react-universal-component/server';
import renderHTML from './renderHTML';

export default function renderApp({ App, clientStats, internals, request, response }) {
    const state = internals.store.getState();
    const location = state.location;
    let state = 200;

    if (location.type === NOT_FOUND) {
        status = 404;
    }  else if (location.kind === 'redirect') {
        return response.redirect(302, location.pathname);
    }

    let html = '';
    try {
        html = ReactDom.renderToString(App);
    } catch (err) {
        console.error(`unable to render React server-side: ${err}`);
    }

    const chunkNames = flushChunkNames();
    const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });
    const renderedHTML = renderHTML({
        state,
        html,
        styles: styles.toString(),
        scripts: cssHash + js.toString()
    });

    response.setHeader('Cache-Control', 'no-cache');
    return response.status(status).send(renderedHTML);
}

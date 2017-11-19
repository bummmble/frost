import React from 'react';
import ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import configureStore from './store';
import App from '../client/components/App';

const createApp = (App, store) => (
    <Provider store={store}>
        <App />
    </Provider>
);

export default ({ clientStats }) => async (req, res, next) => {
    const store = await configureStore(req, res);
    if (!store) {
        return;
    }

    const app = createApp(App, store);
    const appString = ReactDOM.renderToString(app);
    const state = store.getState();
    const stateJson = JSON.stringify(state);
    const chunkNames = flushChunkNames();
    const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });

    return res.send(
        `<!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                ${styles}
            </head>
            <body>
                <script>window.APP_STATE = ${state.json}</script>
                <div id="root">${appString}</div>
                ${cssHash}
                ${js}
            </body>
        </html>`
    );
}

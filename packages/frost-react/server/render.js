import React from 'react';
import ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import configureStore from './configureStore';
import App from '../shared/App';

function createApp(App, store) {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

export default function render({ clientStats }) {
    return async (req, res, next) => {
        const store = await configureStore(req, res);
        if (!store) {
            return;
        }

        const app = createApp(App, store);
        const appString = ReactDOM.renderToString(app);
        const stateJson = JSON.stringify(store.getState());
        const chunkNames = flushChunkNames();
        const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });

        return res.send(
            `
                <!doctype html>
                <html>
                    <head>
                        <meta charset="utf-8">
                        ${styles}
                    </head>
                    <body>
                        <script>window.APP_STATE = ${stateJson}</script>
                        <div root="id">${appString}</div>
                        ${cssHash}
                        ${js}
                    </body>
                </html>
            `
        );
    }
}

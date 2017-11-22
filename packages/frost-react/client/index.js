import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import AppContainer from 'react-hot-loader/lib/AppContainer';
import App from '../shared/App';
import configureStore from '../shared/store';

const history = createHistory();
const { store } = configureStore(history, window.APP_STATE);

function render(App) {
    const root = document.getElementById('root');
    hydrate(
        <AppContainer>
            <Provider store={store}>
                <App />
            </Provider>
        </AppContainer>,
        root
    );
}

render(App);

if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept('../shared/App', () => {
        const App = require('../shared/App').default;
        render(App);
    });
}
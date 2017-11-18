import { createInternals } from '../internals/shared';
import { updateState, renderApp } from '../internals/client';
import State from '../state';
import App from '../App';

const internals = createInternals(State);

try {
    renderApp(App, internals)
} catch (err) {
    throw new Error(`Unable to rehydrate client app: ${err}`);
}



if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('../App', () => {
        const next = require('../App').default;
        renderApp(next, internals);
    });

    module.hot.accept('../state', () => {
        const next = require('../state').default;
        updateState(next, internals);
    });
}

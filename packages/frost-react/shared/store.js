import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { connectRoutes } from 'redux-first-router';

import routes from './routes';
import * as reducers from './state/reducers/index';

const composeEnhancers = (...args) => {
    return typeof window !== 'undefined'
        ? composeWithDevTools({})(...args)
        : compose(...args)
};

export default function configureStore(history, preloadedState) {
    const { reducer, middleware, enhancer, thunk } = connectRoutes(
        history,
        routes
    );

    const rootReducer = combineReducers({ ...reducers, location: reducer });
    const middlewares = applyMiddleware(middleware);
    const enhancers = composeEnhancers(enhancer, middlewares);
    const store = createStore(rootReducer, preloadedState, enhancers);

    if (module.hot && process.env.NODE_ENV === 'development') {
        module.hot.accept('./state/reducers/index', () => {
            const reducers = require('./state/reducers/index');
            const rootReducer = combineReducers({ ...reducers, location: renducer });
            store.replaceReducer(rootReducer);
        });
    }

    return { store, thunk };
}


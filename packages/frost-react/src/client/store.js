import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { connectRoutes } from 'redux-first-router';

import routes from './routes';
import * as reducers from './reducers';

export default (history, preloaded) => {
    const { reducer, middleware, enhancer, thunk } = connectRoutes(
        history,
        routes
    );

    const rootReducer = combineReducers({ ...reducers, location: reducer });
    const middlewares = applyMiddleware(middleware);
    const enhancers = composeEnhancers(enhancer, middlewares);
    const store = createStore(rootReducer, preloaded, enhancers);

    if (module.hot && process.env.NODE_ENV === 'development') {
        module.hot.accept('./reducers/index', () => {
            const reducers = require('./reducers/index');
            const rootReducer = combineReducers({ ...reducers, location: reducer });
            store.replaceReducer(rootReducer);
        });
    }

    return { store, thunk };
}

const  composeEnhancers = (...args) => compose(...args);

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const emptyReducer = (prev = {}, action) => prev;
const emptyMiddleware = store => next => action => next(action);
const emptyEnhancer = param => param;

export const frostReducer = (prev = {}, action) => prev;

export function createRootReducer(reducers, router = null) {
    const Reducers = {
        ...reducers,
        frost: frostReducer
    };

    if (router) {
        Reducers.location = router.reducer;
    }

    return combineReducers(Reducers);
}

export function configureStore(config = {}) {
    const {
        reducers = {},
        middlewares = [],
        enhancers = [],
        state = {},
        router = null,
    } = config;

    const rootReducer = createRootReducer(reducers, router);
    const rootEnhancers = compose(
        applyMiddleware(
            thunk,
            router ? router.middleware : emptyMiddleware,
            ...middlewares
        ),
        router ? router.enhancer : emptyEnhancer,
        ...enhancers
    );

    const store = createStore(rootReducer, state, rootEnhancers);
    return store;
}

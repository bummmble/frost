import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const composeEnhancers =
  (process.env.TARGET === 'web' &&
    process.env.NODE_ENV === 'development' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const emptyReducer = (prev = {}, action) => prev;
export const emptyMiddleware = store => next => action => next(action);
export const emptyEnhancer = param => param;
export const frostReducer = (prev = {}, action) => prev;

export function createRootReducer(reducers, router = null) {
  const Reducers = {
    ...reducers,
    frost: frostReducer,
  };

  if (router) {
    Reducers.location = router.reducer;
  }

  return combineReducers(Reducers);
}

export function createReduxStore(config = {}) {
  const {
    reducers = {},
    middlewares = [],
    enhancers = [],
    state = {},
    router = null,
  } = config;

  const rootReducer = createRootReducer(reducers, router);
  const rootEnhancers = composeEnhancers(
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

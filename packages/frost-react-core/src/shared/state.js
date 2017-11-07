import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const composeEnhancers = (process.env.TARGET === 'web' &&
	process.env.NODE_ENV === 'development' &&
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose;

export const emptyReducers = (prev = {}, action) => prev;
export const emptyMiddleware = store => next => action => next(action);
export const emptyEnhancer = o => o;
export const frostReducer = (prev = {}, action) => prev;
export const getNonce = state => state.frost.nonce;

export const createRootReducer = (reducers, router = null) => {
	const allReducers = {
		...reducers,
		frost: frostReducer
	};

	if (router) {
		allReducers.location = router.reducer;
	}

	return combineReducers(allReducers);
};
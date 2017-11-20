import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { connectRoutes } from 'redux-first-router';

const composeEnhancers = (...args) => {
    return typeof window !== 'undefined'
        ? composeWithDevTools({})(...args)
        : compose(...args)
};

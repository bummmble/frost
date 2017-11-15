import test from 'ava';
import { createReduxStore, createRootReducer } from '../src/shared/state';
import { createReduxRouter } from '../src/shared/router';

test('Create Redux Store - Basic', () => {
    const reducers = {};
    const middlewares = [];
    const enhancers = [];

    expect(createReduxStore({ reducers, middlewares, enhancers })).toBeDefined();
});

test('Create Redux Store - No Reducers', () => {
    const middlewares = [];
    const enhancers = [];

    expect(createReduxStore({ middlewares, enhancers })).toBeDefined();
});

test('Create Redux Store - Empty', () => {
    expect(createReduxStore({ })).toBeDefined();
});

test('Create Redux Store - No params', () => {
    expect(createReduxStore()).toBeDefined();
});

test('Create Root Reducer', () => {
    expect(createRootReducer()).toBeDefined();
});

test('Create Root with a reducer', () => {
    const dummy = prev => prev;
    expect(createRootReducer({ dummy })).toBeDefined();
});

test('Create Store - With Router', () => {
    const router = createReduxRouter();
    expect(router).toBeDefined();
    expect(typeof router).toBe('object');

    const reducers = {};
    const middlewares = [];
    const enhancers = [];
    const store = createReduxStore({ reducers, middlewares, enhancers, router });
    expect(store).toBeDefined();
    expect(typeof store).toBe('object');
});

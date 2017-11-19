import { createReduxStore } from './state';

const defaultState = process.env.TARGET === 'web'
    ? window.APP_STATE
    : null;

export default function createInternals(State, { state = defaultState, req }) {
    const store = createReduxStore({
        reducers: State.getReducers(),
        enhancers: State.getEnhancers(),
        middlewares: State.getMiddlewares(),
        state,
    });

    return {
        store
    };
}

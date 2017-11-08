import { createReduxRouter } from './router';
import { createReduxStore } from './state';

const defaultState = process.env.TARGET === 'web' ? window.APP_STATE : null;

export default function createInternals(
  State,
  { state = defaultState, frost, req } = {},
) {
  if (process.env.TARGET === 'node' && frost != null) {
    if (!state.frost) {
      state.frost = frost;
    }
  }

  const router = createReduxRouter(State.getRoutes(), req ? req.path : null);

  const store = createReduxStore({
    reducers: State.getReducers(),
    enhancers: State.getEnhancers(),
    middlewares: State.getMiddlewares(),
    state,
    router,
  });

  return {
    router,
    store,
  };
}

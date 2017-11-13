import { createRootReducer } from '../shared/state';

export default function update(next, internals) {
  internals.store.replaceReducer(
    createRootReducer(next.getReducers(), internals.router)
  );
}

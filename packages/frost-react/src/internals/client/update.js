import { createRootReducer } from '../shared/state';

export default function updateState(next, internals) {
    internals.store.replaceReducer(createRootReducer(
        next.getReducers(),
        internals.router
    ));
}

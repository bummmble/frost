import deepFetch from './deepFetch';

export default async function fetchData(App, internals) {
    const result = await Promise.all([
        internals.router.thunk(internals.store),
        deepFetch(App)
    ]);
    return result;
}

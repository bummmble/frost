import { connectRoutes } from 'redux-first-router';
import queryString from 'query-string';

export default function createRouter(routes, path = null, config) {
    if (path) {
        config.initialEntries = [path];
    }

    config.querySerializer = queryString;
    return connectRoutes(routes, config);
}

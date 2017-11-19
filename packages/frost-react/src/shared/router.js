import { connectRoutes } from 'redux-first-router';
import queryString from 'query-string';

export default createRouter(history, routes) {
    history.querySerializer = queryString;
    return connectRoutes(history, routes);
}

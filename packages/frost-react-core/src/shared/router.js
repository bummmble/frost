import { connectRoutes } from 'redux-first-router';
import queryString from 'query-string';

export function createReduxRouter(routes, path = null, config = {}) {
	if (path) {
		config.initialEntries = [path];
	}

	config.querySerializer = queryString;
	return connectRoutes(routes, config);
}

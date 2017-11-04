import express from 'express';
import createCore from './core';
import createError from './error';
import createFallback from './fallback';

const defaultStatic = {
	public: '/static',
	path: 'build/client'
};

export default ({ staticConfig = defaultStatic, beforeFallback = [] }) => {
	const server = express();
	createError(server);
	createCore(server);
	if (staticConfig) {
		server.use(staticConfig.public, express.static(staticConfig.path));
	}

	if (beforeFallback.length > 0) {
		beforeFallback.forEach(middleware => {
			if (Array.isArray(middleware)) {
				server.use(...middleware);
			} else {
				server.use(middleware);
			}
		});
	}

	createFallback(server);
	return server;
};

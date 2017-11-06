import koa from 'koa';
import serveStatic from 'koa-serve-static';
import createCore from './core';
import createError from './error';
import createFallback from './fallback';
import createSecurity from './security';

const defaultStatic = {
  public: '/static',
  path: 'build/client',
};

export default ({
  staticConfig = defaultStatic,
  afterSecurity = [],
  beforeFallback = [],
}) => {
  const server = new koa();
  createError(server);
  createSecurity(server);

  if (afterSecurity.length > 0) {
    afterSecurity.forEach(middleware => {
      if (Array.isArray(middleware)) {
        server.use(...middleware);
      } else {
        server.use(middleware);
      }
    });
  }

  createCore(server);
  if (staticConfig) {
    server.use(serveStatic(staticConfig.public, staticConfig.path));
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

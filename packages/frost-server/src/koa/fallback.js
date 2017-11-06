import koa404 from 'koa-404-handler';

export default server => {
  server.use(koa404());
};

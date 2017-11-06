import errorHandler from 'koa-better-error-handler';

export default server => {
  server.context.onerror = errorHandler;
};

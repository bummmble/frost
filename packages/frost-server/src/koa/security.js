import helmet from 'koa-helmet';
import methodOverride from 'koa-methodoverride';

export default server => {
  server.use(helmet());
  server.use(methodOverride());
};

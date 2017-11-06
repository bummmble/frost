import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import responseTime from 'koa-response-time';
import json from 'koa-json';

export default server => {
  server.use(compress());
  server.use(bodyParser());
  server.use(responseTime());
  server.use(json());
};

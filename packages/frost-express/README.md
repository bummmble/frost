# Frost Express

A centralized, Express http-server to be used with the Frost platform

> Frost Server helps provide a solid, easily extensible foundation for fast-development of applications using node.

> Frost Server still has no official release so the API is slim and the servers themselves a bit lacking. This package is not production ready and should not be used outside of the Frost-Builder dev server

## Features

- A solid foundation for starting an Express project
- Pretty error handling via [Pretty Error](https://github.com/AriaMinaei/pretty-error)
- Security is a top priority utilizing [hpp](https://github.com/analog-nico/hpp) and [Helmet](https://github.com/helmetjs/helmet)
- Easily extensible middleware system
- Exported, extensible Mongoose configuration for MongoDB


## Api

### createExpressServer

```js
createExpressServer(staticConfig, afterSecurity, beforeFallback, enableNonce)
```
- staticConfig: takes an object as an argument that defines where you want to serve your static files from
  ```js
  const staticConfig = {
    public: 'build/client',
    path: '/static/'
  };
  ``` 
- afterSecurity: an array of middlewares (can be an array of arrays of middleware) to be added after the security policies have
  been added.
  
- beforeFallback: an array of middlewares (can be an array of arrays of middleware) to be added before the fallback functionality is added. This is where you want to manage Hot Reloading.
  
- enableNonce: a Boolean that determines whether an nonce should be added to the response object


### createMongoose
```js
const mongoose = new createMongoose({
    // agenda is not set by default, but you can 
    // pass in an instance here and it will connect
    // agenda with the default mongoose instance
    agenda: new Agenda(),

    // how often we should check to reconnect to mongo
    reconnectTime: 3000,

    // Sets the mongoose Promise
    Promise: global.Promise,

    // default logger, can use Frost Logger from frost-shared if desired
    logger: console,

    // mongo connection options and db name
    mongo: {
        url: 'mongodb://localhost:27017/test',
        options: {
            // opt-in to use new connection logic
            useMongoClient: true,
            // maximum number of reconnection attempts
            reconnectTries: Number.MAX_VALUE
        }
    }
}).mongoose
```

# Frost Server

A collection of centralized http server starters. These are the default servers for the Frost Builder.

> Frost Server helps provide a solid, easily extensible foundation for fast-development of applications using node.

> Frost Server still has no official release so the API is slim and the servers themselves a bit lacking. This package is not production ready and should not be used outside of the Frost-Builder dev server

## Features

- A choice of either an Express or a Koa based server
- Security policies to protect your assets and users
- Pretty Error handling
- Extensible middleware system


## Api

### createExpressServer

```
createExpressServer(staticConfig, afterSecurity, beforeFallback, enableNonce)
```

The Frost Builder is meant to be a hands-off, easy way to get started with Modern Web Applications.

> While the Builder was created with the intent on creating isomorphic, progressive web-applications, it is actually completely framework agnostic and lets you build your applications how you want by exposing ways to configure every detail of the build.

## Features

- Doesn't plan for or care what framework you are or are not using
- Semi-Automatic Code-Splitting for CSS and JS
- Supports CSS Modules for isolated component style
- Supports bundling both Client and Server for isomorphic rendering
- Hot Loading for both the Client and theServer
- Supports postcss and progressive image-loading out of the box
- Supports source-maps and compile-time linting
- Comes packaged with prettier for lovely code
- Serviceworker support out of the box as well as manifest loading through the pwa config option
- Easy to use cli interface, but is easily usable in external build scripts

## Install
```console
$ npm install -D frost-builder
```

or
```console
$ yarn add -D frost-builder
```

## Usage

Using the builder from the command line is easy. Either install the builder globally and execute the commands below directly, or install it locally and use npm scripts to do the same

```
Usage
$ frost

Options:
    --verbose, -v  		Includes extensive messages to helper with developer experience  
    --quiet, -q  		Surpresses everything but important warnings and errors

Commands:
    build  		Cleans the build directories and builds production client and server bundles
    build:client        Functions the same as build but only acts on the client bundles
    build:server        Functions the same as build but only acts on the server bundles
    dev                 Spins up a dev server with HMR
    clean               Cleans up the client and server build directories
```

### API

#### buildClient && buildServer

> These build functions are the same, unique only in their target. For this reason the usage is the same, even if only the client is presented below

```js
import { buildClient, buildServer } from 'frost-builder';

async function BuildClient() {
    // This can be a frost.config.js file that is loaded in
    // or any other object to be used in the build function
    const config = {};
    await buildClient(config);
}

async function BuildServer() {
    const config = {};
    await buildServer(config);
}
```

#### cleanClient && cleanServer

These functions clean the respective build folders. These are normally not used as a standalone, but as part of a process like below

```js
import { buildClient, cleanClient } from 'frost-builder'

async function BuildClient() {
    // config must have a an output.client defined (output.server for buildServer)
    const config = {};
    await cleanClient(config);
    await buildClient(config);
}
```

#### start

Start takes a configuration object and creates an hot-reloaded development Express server.

```
import { start as startDev } from 'frost-builder';

const config = {};
startDev(config);
```

#### compiler

> This is a non-essential part of the API that exists only for specific use cases

The compiler export is the core of the Frost Builder. The compiler accepts a target, an environment variable representing process.env.NODE_ENV, and a configuration object and generates the proper Webpack configuration. This is not a means for modifying the compiler itself. If you would like to customize the Webpack configuration to a larger extent, you should write a hook (see config.hooks). This exists for direct usage and makes integration with more complex build chains easier.

** example coming **

#### connect

> This is a non-essential part of the API that exists only for specific use cases

Connect takes a server configuration and a Webpack multiCompiler object and starts a development server running on process.env.SERVER_PORT. This is useful for when you want to use a custom server in development rather than use the default [Frost Express server](https://github.com/Bashkir15/tree/master/packages/frost-express).

```js
import { connect, compiler } from 'frost-builder';
import express from 'express';
import webpack from 'webpack';

const server = express();
const config = {};

const clientConfig = compiler('client', 'development', config);
const serverConfig = compiler('server', 'development', config);
const multiCompiler = webpack([clientConfig, serverConfig]);

connect(server, multiCompiler);
```

#### create

> This is a non-essential part of the API that exists only for specific use cases

Create is a bear bones utility to create a Webpack Multi-Compiler and the appropriate middleware needed for Hot-Module Reloading. This is great for when you want to use connect with your own custom server, but don't want to have to use the compiler directly to create your Multi Compiler. Create takes a configuration object that will be used create the Webpack bundles.

```js
import { create, connect } from 'frost-builder';
import express from 'express';

const config = {};
const { middleware, multiCompiler } = create(config);

const server = express();
server.use(...middleware);
connect(server, multiCompiler);
```


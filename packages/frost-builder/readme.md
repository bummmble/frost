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

## Customizing

To use this builder you can supply a frost.config.js file in your root directory. You can peer into the source to see the large list of customizable options you can pass in through this config.

Don't care about that and really just want the plugins but don't want a lot of other stuff? You can include a hook in the config file with your own webpack config that will be used in place of the compiler.

> More on this coming soon

# Frost Builder

> A simple way to control your application builds and targets

## Is this another boilerplate?

Frost does offer a framework agnostic "Renderer" that builds production ready bundles and has a universal development server, but that isn't the goal. The goal is to make complex builds simpler.

At it's core, Frost is just a task runner. The tasks that Frost runs are built around "Renderers". A Renderer an object that operates on Webpack compiler instances.Frost comes packaged with some prepared compiler configurations as well as a [default renderer](https://github.com/Bashkir15/frost/blob/master/packages/frost-builder/src/renderers/FrostRenderer.js) to demonstrate the concept.

## API

### Basic Usage

#### run
The Run command takes an environment and a command and will run that command for all current renderers associated with the build.

```js
run(env, command)
// env: The environment the build should run in
// command: The command that should be run by the renderer
```

#### runOne
The runOne command is similar to run, but takes a new parameter to specify which renderer should run the command

```js
runOne(env, renderer, command) {
    // env: The environment the build should run in
    // rendere: The specific renderer that is the target
    // command: The command the renderer should run
}
```

#### runSequence
The runSequence command is essentially like running runOne, multiple times. The command takes in an array of objects containing an environment, a renderer, and a command. These will then be run in sequence.

```js
runSequence(sequence) {
    // sequence: [{ env: 'development', renderer: 'frost', command: 'server' }]
}
```

### Default Usage

As said above, Frost comes packaged with a default Renderer that will run your builds when there is no custom Renderer specified. Fine grained options can be tuned in your frost.config file, but the main commands exposed by the default Renderer are

#### Client

```js
client(env) {
    // client takes the client entry from your frost config and creates a bundle in the specified env
}
```

#### Server

```js
server(env) {
    // Server takes the server entry from your frost config and creates a bundle in the specified env
}
```

#### Universal

```js
universal(env) {
    // Universal looks at both the client and server entry and creates a Webpack Multicompiler to bundle both builds in the specified env
}
```

#### Dev

```js
dev() {
    // Dev creates a Universal, hot-reloaded development server by creating a Webpack Multicompiler and express server to reload on changes
}
```

### With a set of custom renderers

Using Frost with custom renderers is as easy as making the appropriate changes to your config file. Simply create a renderers entry, and populate the Array with the name of the renderers you would like to include. Frost will resolve them from your node_modules

```js

config config = {
    ...,
    renderers: ['custom-renderer1', 'custom-renderer2']
}
```


## Creating your own Renderer
...coming soon!


## Modifying the build through the configuration

For most builds that will not require custom renderers, the configuration file you provide is the easiest place to tweak your builds to your liking. For a full list of options, check out the [schema](https://github.com/Bashkir15/frost/blob/master/packages/frost-builder/src/core/schema.js)

### Modifying the entry
The config provides a client and server entry file location

```js
const config = {
    entry: {
        client: 'path/to/entry.js',
        server: 'path/to/server.js'
    }
};
```

### Creating a Vendor Bundle
Simply add the names of the vendors to the config vendor entry array

```js
const config = {
    entry: {
        ...,
        vendor: ['react', 'react-router', ...]
    }
};
```

### Customizing the output
Customizing the output is essentially the same as the entry.

```js
const config = {
    output: {
        server: 'path/to/server/output',
        client: 'path/to/client/output',
        public: '/your/public/path'
    }
}
```

### Using Hot-Module Reloading
To use Hot-Module Reloading, in addition to running the dev command, you must have it turned on in the config (defaults to true)

```js
const config = {
    build: {
        useHmr: true
    }
}
```

### Enabling Source-Maps
Source maps slow down build time, but are incredibly useful. You can enable them in the build section of the config

```js
const config = {
    build: {
        sourceMaps: true
    }
}
```
### Using a CSS Preprocessor
Frost supports the use of Sass, Scss, Less, and Stylus. None of them are enabled by default.

```js
const config = {
    build: {
        css: {
            preprocess: 'sass' // 'scss', 'less', 'stylus'
        }
    }
}
```

### Extracting CSS
By Default, Frost is setup to extract CSS Chunks, this is useful for code-split, universal applications. You can turn off extraction entirely, or only extract a single file with extract-text.

```js
const config = {
    build: {
        css: {
            extract: 'text' // 'chunks', 'none'
        }
    }
}
```

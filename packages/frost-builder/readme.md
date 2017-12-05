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

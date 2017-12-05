# Frost Builder

> A simple way to control your application builds and targets

## Is this another boilerplate?

Frost does offer a framework agnostic "Renderer" that builds production ready bundles and has a universal development server, but that isn't the goal. The goal is to make complex builds simpler.

At it's core, Frost is just a task runner. The tasks that Frost runs are built around "Renderers". A Renderer an object that operates on Webpack compiler instances.Frost comes packaged with some prepared compiler configurations as well as a [default renderer](https://github.com/Bashkir15/frost/blob/master/packages/frost-builder/src/renderers/FrostRenderer.js).


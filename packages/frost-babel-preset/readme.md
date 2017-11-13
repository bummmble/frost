# Frost Babel Preset

> Frost Babel Preset (Or babel-preset-frost on npm) is a modern Babel config for a good development experience

## Features

- React and Flowtype Support baked in for handling JSX and eliminating non-standard Flowtype definitions
- [Lodash Plugin](https://github.com/lodash/babel-plugin-lodash) to allow cherry-picking of larger, traditionally exported libraries such as lodash, async, rambda, and recompose
- Support for converting up-and-coming ES standards such as class properties and object-rest-spread
- Optimizations for React during development (enhanced debug capabilities) and production (a lot of code elimination and element ops)
- High performance async/await transpiling using [Fast Async](https://github.com/MatAtBread/fast-async) and [nodeent](https://github.com/MatAtBread/nodent#performance).
- Support for dynamic 'import()' statements which are used for dynamic chunk creation since Webpack version 2
- Supports Dynamic CSS loading and automatic chunkNames using [universal-import](https://github.com/faceyspacey/babel-plugin-universal-import)
- Prefers external polyfills and helpers instead of baked-in code which helps out largely with code-splitting and caching
- Transpilation ignores Generators. Transpiling these results in super slow code

## Defaults

These are the default options of the configuration. These can easily be overwritten by passing options to the preset

```js
const defaults = {
    // Whether to print hints on the selected settings
    debug: false

    // One of the following
    // - 'node'/'nodejs'/'script'/'binary': any NodeJS execution with wide support to the last LTS
    // 'node8': Identical to the previous, but target the next coming LTS (Node v8.0.0)
    // 'current'/'test': Current Node Version
    // 'browser'/'web': Browsers as defined by browserslist
    // 'library': Used for publishing npm libraries
    // 'es2015': Same as 'library' but targets es2015 capable engines only
    // 'modern': Same as 'library' but targets more forward-looking engines than es2015
    // {}: any custom setup supported by Env-Preset
    target: 'nodejs'

    // Chose environment based on env variables.. or supply your own
    env: 'auto',

    // Chose automatically depending on target, or choose one
    // 'commonjs': Transpile module imports to cjs
    // false: Keep module imports as they are (this is required for tree-shaking)
    'auto': Auto selection based on target
    modules: 'auto'
}

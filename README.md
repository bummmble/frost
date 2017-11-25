[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Maintainability](https://api.codeclimate.com/v1/badges/66fa63123c49691fa50e/maintainability)](https://codeclimate.com/github/Bashkir15/frost/maintainability)

<img src="./assets/logo.png" alt="Frost Logo" width="250">

> Frost is a collection of packages and utilities to make creating modern web applications simpler so instead of focusing on large amounts of configuration you can focus on your business logic. 

## Packages

### [Frost Builder](https://github.com/Bashkir15/frost/tree/master/packages/frost-builder)
- Doesn't plan for or care what framework you are or are not using
- Semi-Automatic Code-Splitting for CSS and JS
- Allows for Tree-Shaking of CommonJS Modules
- Parallelize expensive loaders
- Supports CSS Modules for isolated component style
- Supports bundling both Client and Server for isomorphic rendering
- Hot Loading for both the Client and theServer
- Supports postcss and progressive image-loading out of the box
- Supports source-maps and compile-time linting
- Comes packaged with prettier for lovely code
- Serviceworker support out of the box as well as manifest loading through the pwa config option
- Easy to use cli interface, but is easily usable in external build scripts

### [Frost Express](https://github.com/Bashkir15/frost/tree/master/packages/frost-express)
- A solid foundation for starting an Express project
- Pretty error handling via [Pretty Error](https://github.com/AriaMinaei/pretty-error)
- Security is a top priority utilizing [hpp](https://github.com/analog-nico/hpp) and [Helmet](https://github.com/helmetjs/helmet)
- Easily extensible middleware system
- Exported, extensible Mongoose configuration for MongoDB
- Allows for Graceful shutdown of Server-Side Services

### [Frost React](https://github.com/Bashkir15/frost/tree/master/packages/frost-react-core)
- A boilerplate for creating Universal React Apps using the Frost Builder

### [Frost Utils](https://github.com/Bashkir15/frost/tree/master/packages/frost-utils)

### [Frost Backup](https://github.com/Bashkir15/frost/tree/master/packages/frost-backup)
- An extremely simple ecnrypted and compressed backup to Amazon S3 for MongoDB/Redis 

### [Frost Babel Preset](https://github.com/Bashkir15/frost/tree/master/packages/frost-babel-preset)
- React and Flowtype Support baked in for handling JSX and eliminating non-standard Flowtype definitions
- [Lodash Plugin](https://github.com/lodash/babel-plugin-lodash) to allow cherry-picking of larger, traditionally exported libraries such as lodash, async, rambda, and recompose
- Support for converting up-and-coming ES standards such as class properties and object-rest-spread
- Optimizations for React during development (enhanced debug capabilities) and production (a lot of code elimination and element ops)
- High performance async/await transpiling using [Fast Async](https://github.com/MatAtBread/fast-async) and [nodeent](https://github.com/MatAtBread/nodent#performance).
- Support for dynamic 'import()' statements which are used for dynamic chunk creation since Webpack version 2
- Supports Dynamic CSS loading and automatic chunkNames using [universal-import](https://github.com/faceyspacey/babel-plugin-universal-import)
- Prefers external polyfills and helpers instead of baked-in code which helps out largely with code-splitting and caching
- Transpilation ignores Generators. Transpiling these results in super slow code

### [Frost Eslint](https://github.com/Bashkir15/frost/tree/master/packages/frost-eslint)

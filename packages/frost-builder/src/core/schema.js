export default {
  mode: {
    type: 'string',
    defaults: 'universal'
  },

  entry: {
    client: {
      type: 'path',
      defaults: 'client/index.js'
    },

    server: {
      type: 'path',
      defaults: 'server/index.js'
    },

    vendor: {
      type: 'array',
      defaults: []
    }
  },

  output: {
    client: {
      type: 'path',
      defaults: 'build/client'
    },

    server: {
      type: 'path',
      defaults: 'build/server'
    },

    public: {
      type: 'url',
      defaults: '/static/'
    }
  },

  files: {
    babel: {
      type: 'regex',
      defaults: /\.(js|mjs|jsx)$/,
    },

    styles: {
      type: 'regex',
      defaults: /\.(css|sss|pcss)$/,
    },

    images: {
      type: 'regex',
      defaults: /\.(jpg|png|gif|webp)$/
    },

    fonts: {
      type: 'regex',
      defaults: /\.(eot|svg|otf|ttf|woff|woff2)$/
    },

    video: {
      type: 'regex',
      defaults: /\.(mp4|webm)$/
    },

    graphql: {
      type: 'regex',
      defaults: /\.(graphql|gql)$/
    }
  },

  hmr: {
    type: 'boolean',
    defaults: true
  },

  postcss: {
    type: 'boolean',
    defaults: false
  },

  sourceMaps: {
    type: 'boolean',
    defaults: false
  },

  compression: {
    kind: {
      type: 'string',
      defaults: 'babili'
    },

    babiliClientOptions: {
      type: 'object',
      defaults: {}
    },

    babiliServerOptions: {
      type: 'object',
      defaults: {}
    },

    uglifyOptions: {
      type: 'object',
      defaults: {}
    }
  },

  images: {
    type: 'object',
    defaults: {}
  },

  serverOptions: {
    useHttps: {
      type: 'boolean',
      defaults: false
    },

    keyPath: {
      type: 'path',
      defaults: 'localhost.key'
    },

    certPath: {
      type: 'path',
      defaults: 'localhost.cert'
    }
  },

  performance: {
    type: 'boolean',
    defaults: false
  },

  pwa: {
    type: 'object',
    defaults: {}
  },

  autoDll: {
    use: {
      type: 'boolean',
      defaults: false
    },

    entries: {
      type: 'object',
      defaults: {}
    }
  },

  verbose: {
    type: 'boolean',
    defaults: false
  }
}

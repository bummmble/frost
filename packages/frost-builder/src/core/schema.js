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

  build: {
    useHmr: {
        type: 'boolean',
        defaults: true
    },

    postcss: {
        type: 'object-or-bool',
        defaults: {
            loader: 'postcss-loader'
        }
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

    performance: {
        type: 'object-or-bool',
        defaults: false
    },

    images: {
        type: 'object',
        defaults: {}
    }
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

  pwa: {
    hasServiceWorker: {
        type: 'boolean',
        defaults: false
    },

    workerEntry: {
        type: 'path',
        defaults: 'client/sw.js'
    }
  },

  verbose: {
    type: 'boolean',
    defaults: false
  }
}

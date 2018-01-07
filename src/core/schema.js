export default {
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
        publicPath: {
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
            defaults: /\.(css|sss|pcss|less|sass|scss|styl|stylus)$/,
        },

        images: {
            type: 'regex',
            defaults: /\.(jpg|jpeg|png|gif|webp|svg|gif)$/
        },

        fonts: {
            type: 'regex',
            defaults: /\.(eot|svg|otf|ttf|woff|woff2)$/
        },

        video: {
            type: 'regex',
            defaults: /\.(mp4|webm)$/
        },

        typescript: {
            type: 'regex',
            defaults: /\.(ts|tsx)$/
        },

        elm: {
            type: 'regex',
            defaults: /\.elm$/
        },

        rust: {
            type: 'regex',
            defaults: /\.rs$/
        },

        graphql: {
            type: 'regex',
            defaults: /\.(graphql|gql)$/
        }
    },

    styles: {
        postcss: {
            type: 'object-or-bool',
            defaults: false
        },

        cssLoader: {
            type: 'object-or-bool',
            defaults: false
        },

        preprocessor: {
            type: 'string',
            defaults: 'none'
        },

        extract: {
            type: 'string',
            defaults: 'none'
        },

        extractOptions: {
            type: 'object',
            defaults: {}
        }
    },

    babelOptions: {
        type: 'object',
        defaults: {}
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
            defaults: {
                booleans: false,
                deadcode: true,
                flipComparisons: false,
                mangle: false,
                mergeVars: false
            }
        },

        uglifyOptions: {
            type: 'object',
            defaults: {
                compress: {
                    unsafe_math: true,
                    unsafe_proto: true,
                    keep_infinity: true,
                    passes: 2
                },
                output: {
                    ascii_only: true,
                    comments: false
                }
            }
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

    sourceMaps: {
        type: 'string-or-bool',
        defaults: true
    },

    subresourceIntegrity: {
        type: 'object-or-bool',
        defaults: false
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

    useTypescript: {
        type: 'object-or-bool',
        defaults: false
    },

    useElm: {
        type: 'object-or-bool',
        defaults: false
    },

    useRust: {
        type: 'object-or-bool',
        defaults: false
    },

    verbose: {
        type: 'boolean',
        defaults: false
    },

    quiet: {
        type: 'boolean',
        defaults: false
    },

    webpack: {
        useHappyPack: {
            type: 'boolean',
            defaults: false
        },

        useHmr: {
            type: 'boolean',
            defaults: true
        },

        performance: {
            type: 'object-or-bool-or-function',
            defaults: false
        },

        plugins: {
            client: {
                type: 'array',
                defaults: []
            },
            server: {
                type: 'array',
                defaults: []
            }
        }
    },

    framework: {
        name: {
            type: 'string',
            defaults: 'none'
        },

        react: {
            useHotLoader: {
                type: 'boolean',
                defaults: false
            }
        },

        vue: {
            useVueLoader: {
                type: 'object-or-bool',
                defaults: false
            },

            useSSR: {
                type: 'object-or-bool',
                defaults: false
            }
        }
    },

    renderers: {
        type: 'array',
        defaults: []
    }
}

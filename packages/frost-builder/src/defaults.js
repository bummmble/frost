export default {
  entry: {
    client: 'client/index.js',
    server: 'server/index.js',
  },

  output: {
    client: 'build/client',
    server: 'build/server',
    public: '/static/',
  },

  files: {
    babel: /\.(js|mjs|jsx)$/,
    styles: /\.(css|sss|pcss)$/,
    images: /\.(jpg|png|gif)$/,
    fonts: /\.(eot|svg|otf|ttf|woff|woff2)$/,
    video: /\.(mp4|webm)$/,
  },

  cacheLoader: {},
  hmr: true,
  postcss: true,
  sourceMaps: true,
  compression: {
    type: 'babili',
    babiliClientOptions: {},
    babiliServerOptions: {
      booleans: false,
      deadcode: true,
      flipComparisons: false,
      mangle: false,
      mergeVars: false,
    },
    uglifyOptions: {
      compress: {
        unsafe_math: true,
        unsafe_proto: true,
        keep_infinity: true,
        passes: 2,
      },
      output: {
        ascii_only: true,
        comments: false,
      },
    },
  },
  images: {
    progressive: true,
    optimizationLevel: 7,
    interlaced: false,
    pngquant: {
      quality: '65-90',
      speed: 4,
    },
  },
  babel: {},
  prettier: {},
  eslint: {},
  performance: {},
  pwa: {},
  verbose: true,
};

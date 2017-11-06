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
  sourceMaps: false,
  compression: {
    type: 'babili',
    babiliClientOptions: {},

    // Basic compression for server, we don't want dead code
    babiliServerOptions: {
      booleans: false,
      deadcode: true,
      flipComparisons: false,
      mangle: false,
      mergeVars: false,
    },
    uglifyOptions: {
      compress: {
        // Only risky for some rare floating point operations
        unsafe_math: true,
        // Optimize expressions like Array.prototype.map.call into [].map.call
        unsafe_proto: true,
        // Good for chrome perf
        keep_infinity: true,
        // Try hard to export less code
        passes: 2,
      },
      output: {
        // Fix for problematic code like emojis
        ascii_only: true,
        // Remove all the comments!
        comments: false,
      },
    },
  },
  locale: {},
  images: {
    progressive: true,
    optimizationLevel: 7,
    interlaced: false,
    pngquant: {
      quality: '65-90',
      speed: 4,
    },
  },
  babel: {
    presets: [],
    plugins: [],
  },
  prettier: {},
  eslint: {},
  performance: {},
  pwa: {},
  verbose: true,
};

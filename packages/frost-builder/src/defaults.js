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
  },

  cacheLoader: {},
  postcss: true,
  sourceMaps: true,
  compression: {},
  babel: {},
  prettier: {},
  eslint: {},
  performance: {},
  pwa: {},
};

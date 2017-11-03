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
  compression: {},
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
};

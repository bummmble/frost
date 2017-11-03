import { existsSync } from 'fs';

const configureCompiler = (target, env) => {
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isDev = env === 'development';
  const isProd = env === 'production';
  const name = isServer ? 'server' : 'client';
  const webpackTarget = isServer ? 'node' : 'web';

  return {
    isClient,
    isServer,
    isDev,
    isProd,
    name,
    webpackTarget,
  };
};

const buildEntryAndOutput = ({ entry, output, hmr }, isServer) => {
  const mainEntry = isServer ? entry.server : entry.client;
  const vendorEntry = isServer ? entry.serverVendor : entry.clientVendor;
  const hasMain = existsSync(mainEntry);
  const hasVendor = existsSync(vendorEntry);
  const clientOutput = output.client;
  const serverOutput = output.server;

  const hmrMiddleware = "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true&noInfo=true&overlay=false";
  const hasHmr = !isServer && isDev && hmr;
  return {
    mainEntry,
    vendorEntry,
    hasMain,
    hasVendor,
    clientOutput,
    serverOutput,
    hmrMiddleware,
    hasHmr
  };
};

export { configureCompiler, buildEntryAndOutput };

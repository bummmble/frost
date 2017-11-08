import { CHUNK_NAMES } from 'react-universal-component';

// Sync loads the given module on the server by acting on
// Transpiled import() statements from babel-plugin-universal-import
export const loadImport = wrapped => {
  const module = __webpack_require__(wrapped.resolve());
  return module && module.__esModule ? module.default : module;
};

// Register the module for pre-loading on the client
// This injects the chunk name for flushing to the generated HTML
export const preloadImport = wrapped => {
  CHUNK_NAMES.add(wrapped.chunkName());
};

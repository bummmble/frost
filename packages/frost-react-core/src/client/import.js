export function loadImport(wrapped) {
  return wrapped.then(module => {
    return module && module.__esModule ? module.default : module;
  });
}

export function preloadImport(wrapped) {
  return wrapped.load();
}

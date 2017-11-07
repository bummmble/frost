import { CHUNK_NAMES } from 'react-universal-component';

export const loadImport = wrapped => {
	const module = __webpack_require__(wrapped.resolve());
	return module && module.__esModule
		? module.default
		: module;
};

export const preloadImport = wrapped => {
	CHUNK_NAMES.add(wrapped.chunkName());
};
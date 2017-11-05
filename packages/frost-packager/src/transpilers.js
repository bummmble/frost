import createBabel from './helpers/babel';
import createBuble from './helpers/buble';

export default (mode, options) => {
	switch (mode) {
		case 'buble':
		return createBuble(options);

		case 'babel':
		return createBabel(options);

		default:
		return {};
	}
}
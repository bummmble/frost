import fs from 'fs';
const Mode = 0o111;

export default (options = {}) => {
	return {
		name: 'rollup-execute',
		onwrite: ({ file }) => {
			const { mode } = fs.statSync(file);
			const newMode = mode | Mode;
			fs.chmodSync(file, newMode);
		}
	}
}
import { resolve } from 'path';
import { readdirSync } from 'fs-extra';

export default function configureServerExternals({ root }) {
    return readdirSync(resolve(root, 'node_modules'))
        .filter(x => !/\.bin|react-universal-component|webpack-flush-chunks|babel-plugin-universal-import/.test(x))
        .reduce((acc, curr) => {
            acc[curr] = `commonjs ${curr}`;
            return acc;
        }, {});
}

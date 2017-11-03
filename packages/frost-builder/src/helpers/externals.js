import { resolve } from 'path';
import { readdirSync } from 'fs';

export default root => {
  const nodeModules = resolve(root, 'node_modules');
  const externals = fs
    .readdirSync(nodeModules)
    .filter(
      x => !/\.bin|react-universal-component|webpack-flush-chunks/.test(x),
    )
    .reduce((acc, curr) => {
      acc[curr] = `commonjs ${curr}`;
      return acc;
    }, {});
  return externals;
};

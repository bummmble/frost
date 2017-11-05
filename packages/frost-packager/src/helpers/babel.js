import babel from 'rollup-plugin-babel';
export default () => ({
  classic: babel({
    runtimeHelpers: true,
    exclude: ['node_modules/**', '**/*.json'],
  }),
});

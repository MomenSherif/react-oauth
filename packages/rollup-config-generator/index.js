const { defineConfig } = require('rollup');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const { default: dts } = require('rollup-plugin-dts');
const del = require('rollup-plugin-delete');
const cleaner = require('rollup-plugin-cleaner');

const __PROD__ = process.env.NODE_ENV !== 'development';

module.exports = packageJson =>
  [
    {
      input: 'src/index.ts',
      output: [
        {
          file: packageJson.main,
          format: 'cjs',
        },
        {
          file: packageJson.module,
          format: 'esm',
        },
      ],
      external: Object.keys(packageJson.dependencies || {}).concat(
        Object.keys(packageJson.peerDependencies || {}),
      ),
      plugins: [
        __PROD__ &&
          cleaner({
            targets: ['./dist'],
          }),
        peerDepsExternal(),
        nodeResolve({
          extensions: ['.js', '.ts', '.tsx'],
        }),
        commonjs({
          include: 'node_modules/**',
        }),
        typescript({
          useTsconfigDeclarationDir: true,
        }),
      ].filter(Boolean),
    },
    __PROD__ && {
      input: './dist/index.d.ts',
      output: [{ file: './dist/index.d.ts', format: 'esm' }],
      plugins: [
        dts(),
        del({
          hook: 'buildEnd',
          targets: ['./dist/**/*.d.ts', './dist/{types,hooks}'],
          ignore: ['./dist/index.d.ts'],
        }),
      ],
    },
  ].filter(Boolean);

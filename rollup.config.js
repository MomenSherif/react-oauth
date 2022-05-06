import { defineConfig } from 'rollup';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import cleaner from 'rollup-plugin-cleaner';

import packageJson from './package.json';

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: Object.keys(packageJson.dependencies || {}).concat(
      Object.keys(packageJson.peerDependencies || {}),
    ),
    plugins: [
      cleaner({
        targets: ['./dist'],
      }),
      peerDepsExternal(),
      resolve({
        extensions: ['.js', '.ts', '.tsx'],
      }),
      commonjs({
        include: 'node_modules/**',
      }),
      typescript({
        useTsconfigDeclarationDir: true,
      }),
    ],
  },
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [
      dts(),
      del({
        hook: 'buildEnd',
        targets: ['./dist/**/*.d.ts', './dist/{types,hooks}'],
        ignore: ['./dist/index.d.ts'],
      }),
    ],
  },
]);

import { defineConfig } from 'rollup';
import rollupConfigGenerator from 'rollup-config-generator';
import packageJson from './package.json';

export default defineConfig(rollupConfigGenerator(packageJson));

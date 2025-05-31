import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['cjs', 'esm'],
	dts: false,
	splitting: false,
	sourcemap: true,
	clean: true,
	treeshake: true,
	minify: false,
	external: ['@whispers/types'],
	outExtension({ format }) {
		return {
			js: format === 'cjs' ? '.js' : '.mjs',
		};
	},
});

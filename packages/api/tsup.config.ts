import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['cjs', 'esm'],
	dts: {
		resolve: true,
		compilerOptions: {
			paths: {
				'@whispers/types': ['../types/dist'], // ← Must match tsconfig
			},
		},
	},
	splitting: false,
	sourcemap: true,
	clean: true,
	external: ['@whispers/types'],
	tsconfig: './tsconfig.json',
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: false },
	modules: ['@pinia/nuxt', 'nuxt-icon', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
	css: ['~/assets/css/main.css'],
	app: {
		head: {
			title: 'Whispers Creator',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{
					hid: 'description',
					name: 'description',
					content: 'Whispers Creator Dashboard',
				},
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
				},
			],
		},
	},
	pinia: {
		autoImports: ['defineStore', 'acceptHMRUpdate'],
	},
	imports: {
		dirs: ['store'],
	},
	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.API_BASE_URL || 'https://api.whispers.example.com',
		},
	},
	tailwindcss: {
		cssPath: '~/assets/css/main.css',
		configPath: 'tailwind.config.ts',
		exposeConfig: false,
		viewer: true,
	},
	colorMode: {
		classSuffix: '',
		preference: 'system',
		fallback: 'light',
		storageKey: 'theme',
	},
});

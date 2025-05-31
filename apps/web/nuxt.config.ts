export default defineNuxtConfig({
	modules: [
		'@pinia/nuxt',
		'nuxt-icon',
		'@nuxtjs/tailwindcss', // Make sure this module is included here
	],
	css: ['~/assets/css/main.css'], // Ensure Tailwind's CSS file is included
	app: {
		head: {
			title: 'Whispers',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{
					hid: 'description',
					name: 'description',
					content: 'Whispers - Your platform for content creators and subscribers',
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
	tailwindcss: {
		cssPath: '~/assets/css/main.css',
		configPath: 'tailwind.config.ts',
		exposeConfig: false,
		viewer: true,
	},
});

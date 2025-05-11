import Toast, { type PluginOptions } from 'vue3-toastify';
import { defineNuxtPlugin } from '#app';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
	const options: PluginOptions = {
		position: 'top-right',
		autoClose: 3000,
	};
	nuxtApp.vueApp.use(Toast, options);
});

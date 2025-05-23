import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

export default {
	legacy: false,
	locale: 'en',
	fallbackLocale: 'en',
	locales: [
		{ code: 'en', name: 'English' },
		{ code: 'fr', name: 'Français' },
		{ code: 'es', name: 'Español' },
	],
	sync: true,
	detectBrowserLanguage: {
		useCookie: true,
		cookieKey: 'i18n_redirected',
		redirectOn: 'root',
	},
	differentDomains: false,
	skipSettingLocaleOnNavigate: false,
	defaultDirection: 'ltr',
	vueI18n: {
		fallbackWarn: false,
		missingWarn: false,
		silentTranslationWarn: true,
		silentFallbackWarn: true,
		formatFallbackMessages: true,
		postTranslation: (str: string) => str.trim(),
		warnHtmlInMessage: 'off',
		escapeParameterHtml: true,
		modifiers: {
			snakeCase: (str: string) => str.split(' ').join('_'),
		},
	},
	messages: {
		en,
		fr,
		es,
	},
};

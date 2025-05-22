import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useCategories = () => {
	const { t } = useI18n()

	const categoryKeys = [
		'art',
		'music',
		'photography',
		'writing',
		'technology',
		'education',
		'entertainment',
		'lifestyle',
		'sports',
		'gaming',
	]

	const availableCategories = computed(() =>
		categoryKeys.map((key) => ({
			key,
			label: t(`categories.${key}`),
		})),
	)

	return { availableCategories }
}

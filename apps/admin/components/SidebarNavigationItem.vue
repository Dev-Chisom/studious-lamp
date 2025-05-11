<template>
	<div>
		<hr v-if="item.divider" class="my-4 border-gray-200" />
		<NuxtLink
			:to="item.href"
			:class="[
				isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50',
				'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
			]"
		>
			<Icon
				:name="item.icon"
				:class="[
					isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600',
					'mr-3 flex-shrink-0 h-5 w-5',
				]"
			/>
			{{ item.name }}
		</NuxtLink>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});

const route = useRoute();

const isActive = computed(() => {
	if (route.path === props.item.href) {
		return true;
	}
	if (props.item.exact) {
		return false;
	}
	return route.path.startsWith(props.item.href);
});
</script>

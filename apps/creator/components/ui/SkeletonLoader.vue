<template>
	<div>
		<template v-for="n in props.rows" :key="n">
			<div
				:class="[
					'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
					props.circle ? 'rounded-full' : 'rounded',
					'mb-2',
				]"
				:style="{
					width: props.width,
					height: props.height,
					marginBottom: n === props.rows ? '0' : '0.5rem',
				}"
			></div>
		</template>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
  rows: { type: Number, default: 3 },
  width: { type: String, default: '100%' },
  height: { type: String, default: '1.25rem' },
  circle: { type: Boolean, default: false },
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style> 
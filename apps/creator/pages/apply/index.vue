<template>
  <div class="min-h-screen max-w-6xl mx-autox">

    <Head>
      <Title>Become a Creator - Creator Dashboard</Title>
    </Head>
		<div class="container mx-auto px-4 py-8">
			<div>
				<div class="text-left mb-8">
					<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Become a Creator</h1>
				</div>
				<div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
					<div class="p-6 sm:p-8">
            <ApplyForm />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import ApplyForm from '../../components/apply/ApplyForm.vue';

definePageMeta({
  layout: 'creator',
	middleware: ['auth'],
	meta: {
		requiresAuth: true,
	},
});
</script>

<template>
	<div>
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
				{{ title }}
			</h3>
			<div v-show="showNavigation" class="flex items-center gap-2">
				<button
					:disabled="isBeginning" :class="[
						'p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition',
						isBeginning ? 'opacity-50 cursor-not-allowed' : ''
					]" @click="slidePrev">
					<Icon name="lucide:chevron-left" class="h-5 w-5 text-gray-500 dark:text-gray-300" />
				</button>
				<button
					:disabled="isEnd" :class="[
						'p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition',
						isEnd ? 'opacity-50 cursor-not-allowed' : ''
					]" @click="slideNext">
					<Icon name="lucide:chevron-right" class="h-5 w-5 text-gray-500 dark:text-gray-300" />
				</button>
			</div>
		</div>
		<Swiper
			ref="swiperRef" :modules="[Pagination, Navigation, Keyboard]" :slides-per-view="1"
			:keyboard="{ enabled: true }" :pagination="{ clickable: true, el: paginationEl }" :space-between="16"
			:mousewheel="true" :speed="500" effect="slide" class="h-full" @swiper="onSwiper">
			<SwiperSlide v-for="(chunk, index) in chunkedUsers" :key="index">
				<div class="space-y-4">
					<div
						v-for="user in chunk" :key="user.id" class="relative flex flex-col justify-end rounded-xl overflow-hidden 
            aspect-[2/1] w-full group cursor-pointer transition">
						<NuxtLink to="/@user" class="flex-shrink-0">
							<img
								:src="user.banner || user.avatar" :alt="user.name"
								class="absolute inset-0 w-full h-full object-cover" loading="eager" />
							<div
								class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 via-black/40 to-transparent 
              group-hover:from-black/80 group-hover:via-black/60 transition"></div>

							<div class="relative z-10 flex p-4 items-end">
								<img
									:src="user.avatar" :alt="user.name"
									class="w-16 h-16 rounded-full border-4 border-white dark:border-gray-900 object-cover" />
								<div class="ml-4 mb-1">
									<div class="font-bold text-lg text-white">{{ user.name }}</div>
									<div class="text-xs text-gray-200">@{{ user.username }}</div>
									<span v-if="user.expired" class="text-xs text-red-500 dark:text-red-400 ml-2">{{ $t('expired')
									}}</span>
								</div>
							</div>
						</NuxtLink>
					</div>
				</div>
			</SwiperSlide>
		</Swiper>
		<div :ref="setPaginationEl" class="flex justify-center mt-2"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation, Keyboard } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const props = defineProps<{
  users: any[]
  title: string
  usersPerSlide?: number
}>();

const usersPerSlide = props.usersPerSlide ?? 3;
const showNavigation = computed(() => props.users.length > usersPerSlide);
const isBeginning = ref(true);
const isEnd = ref(false);

const chunkArray = (array: any[], size: number) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
const chunkedUsers = computed(() => chunkArray(props.users, usersPerSlide));

const swiperRef = ref<any>(null);
const paginationEl = ref<HTMLElement | null>(null);
const swiperInstance = ref<any>(null);

const setPaginationEl = (el: HTMLElement) => {
  paginationEl.value = el;
};

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper;

  isBeginning.value = swiper.isBeginning;
  isEnd.value = swiper.isEnd;

  swiper.on('slideChange', () => {
    isBeginning.value = swiper.isBeginning;
    isEnd.value = swiper.isEnd;
  });
};

const slidePrev = () => {
  swiperInstance.value?.slidePrev();
};

const slideNext = () => {
  swiperInstance.value?.slideNext();
};
</script>
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
    style="z-index: 400"
    @click="close"
  >
    <div class="relative w-[90vw] h-[90vh] max-w-6xl max-h-[90vh] p-4 flex items-center justify-center">
      <!-- Close button -->
      <button
        type="button"
        class="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/75 transition-colors z-10"
        @click.stop="close"
      >
        <Icon name="lucide:x" class="h-6 w-6" />
      </button>

      <!-- Unified media container -->
      <div
        class="relative flex items-center justify-center bg-neutral-900 rounded-xl shadow-lg p-4 w-full h-full max-h-[80vh] max-w-4xl mx-auto"
        @click.stop
      >
        <!-- Swiper container -->
        <Swiper
          v-if="mediaItems.length > 0"
          :modules="[Navigation, Keyboard]"
          :initial-slide="currentIndex"
          :space-between="30"
          :centered-slides="true"
          :keyboard="{ enabled: true }"
          :navigation="true"
          :loop="false"
          class="w-full h-full"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
        >
          <SwiperSlide v-for="(media, index) in mediaItems" :key="index">
            <div class="w-full h-full flex items-center justify-center">
              <img
                v-if="media.type === 'image'"
                :src="media.url"
                class="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-lg shadow"
        @click.stop
      />
      <video
                v-else-if="media.type === 'video'"
                ref="videoPlayer"
                :src="media.url"
        controls
                class="max-w-full max-h-[70vh] w-auto h-auto rounded-lg shadow"
        @click.stop
                @play="handleVideoPlay"
                @pause="handleVideoPause"
                @ended="handleVideoEnded"
      ></video>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Navigation dots -->
      <div v-if="mediaItems.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        <button
          v-for="(_, index) in mediaItems"
          :key="index"
          type="button"
          class="w-2 h-2 rounded-full transition-colors"
          :class="[
            index === currentIndex 
              ? 'bg-white' 
              : 'bg-white/50 hover:bg-white/75'
          ]"
          @click.stop="swiper?.slideTo(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  mediaItems: {
    type: Array,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close', 'update:currentIndex']);

const videoPlayer = ref(null);
const isVideoPlaying = ref(false);
const swiper = ref(null);

const currentMedia = computed(() => props.mediaItems[props.currentIndex] || {});

// Watch for index changes to handle video state
watch(() => props.currentIndex, () => {
  if (videoPlayer.value) {
    videoPlayer.value.pause();
    isVideoPlaying.value = false;
  }
});

function onSwiper(swiperInstance) {
  swiper.value = swiperInstance;
}

function onSlideChange() {
  if (swiper.value) {
    emit('update:currentIndex', swiper.value.activeIndex);
  }
}

function close() {
  if (videoPlayer.value) {
    videoPlayer.value.pause();
    isVideoPlaying.value = false;
  }
  emit('close');
}

function handleVideoPlay() {
  isVideoPlaying.value = true;
}

function handleVideoPause() {
  isVideoPlaying.value = false;
}

function handleVideoEnded() {
  isVideoPlaying.value = false;
}
</script> 

<style>
.swiper-button-next,
.swiper-button-prev {
  color: white !important;
  background: rgba(0, 0, 0, 0.5);
  width: 40px !important;
  height: 40px !important;
  border-radius: 50%;
  transition: background-color 0.2s;
  top: 50% !important;
  transform: translateY(-50%);
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  background: rgba(0, 0, 0, 0.50);
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 20px !important;
}

.swiper-button-disabled {
  opacity: 0.35 !important;
  cursor: auto !important;
  pointer-events: none !important;
}

/* Prevent click events on navigation buttons from bubbling */
.swiper-button-next,
.swiper-button-prev {
  pointer-events: auto !important;
}
</style> 
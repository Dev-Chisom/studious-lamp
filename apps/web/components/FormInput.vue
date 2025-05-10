<template>
  <div>
    <label 
      v-if="label" 
      :for="id" 
      class="form-label"
    >
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>
    
    <div class="relative mt-1">
      <div 
        v-if="icon" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <Icon :name="icon" class="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        :id="id"
        ref="input"
        v-bind="$attrs"
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :class="[
          'form-input',
          icon ? 'pl-10' : '',
          error ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : '',
          'bg-white text-gray-900 border-gray-300 placeholder-gray-400',
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      
      <div 
        v-if="type === 'password' && showPasswordToggle" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <button
          type="button"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
          @click="togglePasswordVisibility"
        >
          <Icon
            :name="passwordVisible ? 'lucide:eye-off' : 'lucide:eye'"
            class="h-5 w-5"
          />
        </button>
      </div>
    </div>
    
    <p v-if="error" class="form-error text-error-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substring(2, 9)}`
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  showPasswordToggle: {
    type: Boolean,
    default: true
  },
  autofocus: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);

const input = ref(null);
const passwordVisible = ref(false);
const inputType = computed(() => {
  if (props.type === 'password' && passwordVisible.value) {
    return 'text';
  }
  return props.type;
});

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

onMounted(() => {
  if (props.autofocus && input.value) {
    input.value.focus();
  }
});
</script>
<template>
  	<component
    :is="computedTag"
    :class="[
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      sizeClasses,
      variantClasses,
      className,
    ]"
    v-bind="buttonAttrs"
  >
    		<Icon v-if="loading" name="lucide:loader-2" class="mr-2 h-4 w-4 animate-spin" /> 		<Icon
      v-if="icon && !loading"
      :name="icon"
      class="mr-2 h-4 w-4"
    />
    		<slot /> 	</component
  >
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'
type ButtonType = 'button' | 'submit' | 'reset'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: string
  loading?: boolean
  disabled?: boolean
  to?: string | object
  href?: string
  type?: ButtonType
  className?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'default',
  icon: '',
  loading: false,
  disabled: false,
  to: undefined,
  href: undefined,
  type: 'button',
  className: '',
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:text-gray-900 dark:hover:bg-primary-400'
    case 'secondary':
      return 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 dark:bg-secondary-500 dark:text-gray-900 dark:hover:bg-secondary-400'
    case 'outline':
      return 'border border-gray-300 bg-white dark:bg-gray-900 text-gray-700 hover:bg-gray-50 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
    case 'ghost':
      return 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-100'
    case 'link':
      return 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline p-0 h-auto dark:text-primary-400 dark:hover:text-primary-300'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:text-gray-900 dark:hover:bg-red-400'
    default:
      return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:text-gray-900 dark:hover:bg-primary-400'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 px-3 text-xs'
    case 'default':
      return 'h-10 px-4 py-2 text-sm'
    case 'lg':
      return 'h-12 px-6 text-base'
    case 'icon':
      return 'h-10 w-10 p-0'
    default:
      return 'h-10 px-4 py-2 text-sm'
  }
})

const computedTag = computed(() => {
  if (props.to) {
    return 'NuxtLink'
  }
  if (props.href) {
    return 'a'
  }
  return 'button'
})

interface ButtonAttrs {
  to?: string | object
  href?: string
  type?: ButtonType
  disabled: boolean
}

const buttonAttrs = computed<ButtonAttrs>(() => {
  const attrs: ButtonAttrs = {
    disabled: props.disabled || props.loading,
  }

  if (props.to) {
    attrs.to = props.to
  } else if (props.href) {
    attrs.href = props.href
  } else {
    attrs.type = props.type
  }

  return attrs
})
</script>

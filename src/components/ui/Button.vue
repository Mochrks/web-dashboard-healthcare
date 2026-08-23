<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 select-none outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-med-bg',
      buttonStyles,
      sizeStyles,
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <span v-if="$slots.icon && !loading" class="flex items-center justify-center">
      <slot name="icon"></slot>
    </span>

    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  type: { type: String as () => 'button' | 'submit' | 'reset', default: 'button' },
  variant: {
    type: String,
    default: 'default',
    validator: (v: string) =>
      ['default', 'medical', 'ai', 'outline', 'ghost', 'danger', 'success'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v: string) => ['sm', 'md', 'lg'].includes(v)
  },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
})

defineEmits(['click'])

const sizeStyles = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-xs rounded-lg'
    case 'lg':
      return 'px-6 py-3 text-base rounded-2xl'
    default:
      return 'px-4 py-2 text-sm rounded-xl'
  }
})

const buttonStyles = computed(() => {
  if (props.disabled) {
    return 'bg-med-card border border-med-border text-med-text-muted cursor-not-allowed opacity-50'
  }

  switch (props.variant) {
    case 'medical':
      return 'bg-med-teal hover:bg-med-teal/90 text-white active:scale-95 shadow-apple-subtle hover:shadow-apple-hover focus:ring-med-teal'
    case 'ai':
      return 'bg-med-purple hover:bg-med-purple/90 text-white active:scale-95 shadow-apple-subtle hover:shadow-apple-hover focus:ring-med-purple'
    case 'danger':
      return 'bg-med-danger hover:bg-med-danger/90 text-white active:scale-95 shadow-apple-subtle hover:shadow-apple-hover focus:ring-med-danger'
    case 'success':
      return 'bg-med-success hover:bg-med-success/90 text-white active:scale-95 shadow-apple-subtle hover:shadow-apple-hover focus:ring-med-success'
    case 'outline':
      return 'bg-med-card border border-med-border hover:border-med-primary/40 hover:bg-med-card-sec text-med-text active:scale-95 focus:ring-med-primary shadow-apple-subtle hover:shadow-apple-hover'
    case 'ghost':
      return 'bg-transparent hover:bg-med-card-sec text-med-text-muted hover:text-med-text active:scale-95 focus:ring-med-primary'
    default: // default is primary
      return 'bg-med-primary hover:bg-med-primary/90 text-white active:scale-95 shadow-apple-subtle hover:shadow-apple-hover focus:ring-med-primary'
  }
})
</script>

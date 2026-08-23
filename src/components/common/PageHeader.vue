<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div>
      <h2 class="text-3xl font-bold text-med-text tracking-tight flex items-center gap-2">
        <slot name="icon"></slot>
        {{ title }}
      </h2>
      <p class="text-sm text-med-text-muted mt-2">
        {{ description }}
      </p>
    </div>
    <div class="flex items-center gap-3">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

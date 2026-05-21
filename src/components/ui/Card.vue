<template>
  <div
    :class="[
      'rounded-2xl border transition-all duration-300 relative overflow-hidden',
      secondary ? 'bg-med-card-sec border-med-border' : 'bg-med-card border-med-border',
      hoverGlow ? 'hover:border-med-primary/40 hover:shadow-med-glow' : '',
      hoverGlowAi ? 'hover:border-med-purple/40 hover:shadow-ai-glow' : '',
      hoverGlowDanger ? 'hover:border-med-danger/40 hover:shadow-alert-glow' : '',
      interactive ? 'cursor-pointer transform hover:-translate-y-0.5' : '',
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Shimmer loading state -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-med-card-sec/80 animate-pulse pointer-events-none z-10"
    ></div>

    <!-- Card Header -->
    <div
      v-if="$slots.header || title || subtitle"
      class="p-5 border-b border-med-border/50 flex items-center justify-between gap-4"
    >
      <div>
        <h3
          v-if="title"
          class="text-base font-semibold text-med-text tracking-tight flex items-center gap-2"
        >
          <slot name="title-icon"></slot>
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-xs text-med-text-muted mt-1 font-normal">{{ subtitle }}</p>
      </div>
      <div>
        <slot name="header-action"></slot>
      </div>
    </div>

    <!-- Card Content -->
    <div :class="['p-5', contentClass]">
      <slot></slot>
    </div>

    <!-- Card Footer -->
    <div
      v-if="$slots.footer"
      class="p-5 border-t border-med-border/50 bg-neutral-50 dark:bg-black/10 flex items-center justify-end gap-2"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  secondary: { type: Boolean, default: false },
  hoverGlow: { type: Boolean, default: false },
  hoverGlowAi: { type: Boolean, default: false },
  hoverGlowDanger: { type: Boolean, default: false },
  interactive: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  customClass: { type: String, default: '' },
  contentClass: { type: String, default: '' }
})

defineEmits(['click'])
</script>

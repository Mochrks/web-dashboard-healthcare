<template>
  <teleport to="body">
    <transition name="dialog-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
        @click.self="$emit('close')"
      >
        <transition name="dialog-zoom">
          <div
            :class="[
              'bg-med-card border border-med-border rounded-2xl shadow-med-glow overflow-hidden w-full flex flex-col my-8',
              sizeClasses[size]
            ]"
          >
            <!-- Dialog Header -->
            <div class="px-6 py-5 border-b border-med-border flex items-center justify-between">
              <div>
                <h2
                  v-if="title"
                  class="text-lg font-bold text-med-text tracking-tight flex items-center gap-2"
                >
                  <slot name="title-icon"></slot>
                  {{ title }}
                </h2>
                <p v-if="subtitle" class="text-xs text-med-text-muted mt-1 font-normal">
                  {{ subtitle }}
                </p>
              </div>
              <button
                type="button"
                class="text-med-text-muted hover:text-med-text p-1 hover:bg-med-card-sec rounded-lg transition-colors outline-none"
                @click="$emit('close')"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Dialog Body -->
            <div class="px-6 py-6 overflow-y-auto flex-1 max-h-[70vh]">
              <slot></slot>
            </div>

            <!-- Dialog Footer -->
            <div
              v-if="$slots.footer"
              class="px-6 py-4 bg-neutral-50 dark:bg-black/10 border-t border-med-border flex items-center justify-end gap-3"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  size: {
    type: String as () => 'sm' | 'md' | 'lg' | 'xl',
    default: 'md'
  }
})

defineEmits(['close'])

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl'
}
</script>

<style scoped>
/* Dialog Fade Overlay */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

/* Dialog Zoom Content */
.dialog-zoom-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dialog-zoom-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.dialog-zoom-enter-from,
.dialog-zoom-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>

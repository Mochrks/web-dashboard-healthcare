<template>
  <teleport to="body">
    <transition name="sheet-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>
    </transition>

    <transition :name="`sheet-slide-${side}`">
      <div
        v-if="isOpen"
        :class="[
          'fixed inset-y-0 z-50 bg-med-card border-med-border shadow-2xl flex flex-col w-full max-w-md md:max-w-lg focus:outline-none transition-all duration-300',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r'
        ]"
      >
        <!-- Sheet Header -->
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
            class="text-med-text-muted hover:text-med-text p-1.5 hover:bg-med-card-sec rounded-lg transition-colors outline-none"
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

        <!-- Sheet Content -->
        <div class="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <slot></slot>
        </div>

        <!-- Sheet Footer -->
        <div
          v-if="$slots.footer"
          class="px-6 py-4 bg-neutral-50 dark:bg-black/10 border-t border-med-border flex items-center gap-3"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  side: {
    type: String as () => 'left' | 'right',
    default: 'right'
  }
})

defineEmits(['close'])
</script>

<style scoped>
/* Sheet Fade Overlay */
.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 0.3s ease;
}
.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}

/* Sheet Slide Right Transition */
.sheet-slide-right-enter-active,
.sheet-slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.sheet-slide-right-enter-from,
.sheet-slide-right-leave-to {
  transform: translateX(100%);
}

/* Sheet Slide Left Transition */
.sheet-slide-left-enter-active,
.sheet-slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.sheet-slide-left-enter-from,
.sheet-slide-left-leave-to {
  transform: translateX(-100%);
}
</style>

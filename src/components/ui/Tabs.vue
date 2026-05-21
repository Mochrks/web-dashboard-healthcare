<template>
  <div :class="['w-full', customClass]">
    <!-- Tabs Header list -->
    <div
      class="flex items-center gap-1 p-1 bg-med-card-sec border border-med-border rounded-xl w-max max-w-full overflow-x-auto scrollbar-none mb-6"
    >
      <button
        v-for="tab in options"
        :key="tab.value"
        type="button"
        :class="[
          'px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 whitespace-nowrap select-none outline-none',
          modelValue === tab.value
            ? 'bg-med-card text-med-primary border border-med-border shadow-sm'
            : 'text-med-text-muted hover:text-med-text border border-transparent'
        ]"
        @click="$emit('update:modelValue', tab.value)"
      >
        <span class="flex items-center gap-1.5">
          <slot :name="`icon-${tab.value}`"></slot>
          {{ tab.label }}
        </span>
      </button>
    </div>

    <!-- Active Tab Pane -->
    <div class="transition-all duration-300">
      <slot :active-tab="modelValue"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TabOption {
  label: string
  value: string
}

defineProps({
  options: {
    type: Array as () => TabOption[],
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  customClass: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Hide scrollbar for tabs list */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

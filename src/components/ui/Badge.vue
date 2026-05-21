<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none border transition-all duration-300',
      badgeStyles.container,
      pulse ? 'pulse-status' : ''
    ]"
    :style="pulse ? { boxShadow: badgeStyles.pulseShadow } : {}"
  >
    <span
      v-if="dot"
      :class="['w-1.5 h-1.5 rounded-full', badgeStyles.dot, dotPulse ? 'animate-ping' : '']"
    ></span>
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  variant: {
    type: String,
    default: 'default',
    validator: (v: string) =>
      [
        'default',
        'outline',
        'success',
        'warning',
        'danger',
        'info',
        'purple',
        'esi1',
        'esi2',
        'esi3',
        'esi4',
        'esi5',
        'critical',
        'guarded',
        'stable'
      ].includes(v)
  },
  dot: { type: Boolean, default: false },
  dotPulse: { type: Boolean, default: false },
  pulse: { type: Boolean, default: false }
})

const badgeStyles = computed(() => {
  const v = props.variant

  switch (v) {
    case 'success':
    case 'stable':
      return {
        container: 'bg-med-success/10 border-med-success/20 text-med-success',
        dot: 'bg-med-success',
        pulseShadow: '0 0 0 2px rgba(34, 197, 94, 0.4)'
      }
    case 'warning':
    case 'guarded':
      return {
        container: 'bg-med-warning/10 border-med-warning/20 text-med-warning',
        dot: 'bg-med-warning',
        pulseShadow: '0 0 0 2px rgba(245, 158, 11, 0.4)'
      }
    case 'danger':
    case 'critical':
    case 'esi1':
      return {
        container: 'bg-med-danger/10 border-med-danger/25 text-med-danger',
        dot: 'bg-med-danger',
        pulseShadow: '0 0 0 2px rgba(239, 68, 68, 0.4)'
      }
    case 'esi2':
      return {
        container: 'bg-[#FF6B00]/10 border-[#FF6B00]/25 text-[#FF6B00]',
        dot: 'bg-[#FF6B00]',
        pulseShadow: '0 0 0 2px rgba(255, 107, 0, 0.4)'
      }
    case 'esi3':
      return {
        container: 'bg-[#EAB308]/10 border-[#EAB308]/25 text-[#EAB308]',
        dot: 'bg-[#EAB308]',
        pulseShadow: '0 0 0 2px rgba(234, 179, 8, 0.4)'
      }
    case 'esi4':
      return {
        container: 'bg-med-teal/10 border-med-teal/20 text-med-teal',
        dot: 'bg-med-teal',
        pulseShadow: '0 0 0 2px rgba(20, 184, 166, 0.4)'
      }
    case 'esi5':
      return {
        container: 'bg-med-text-muted/10 border-med-border text-med-text-muted',
        dot: 'bg-med-text-muted',
        pulseShadow: '0 0 0 2px rgba(148, 163, 184, 0.4)'
      }
    case 'info':
      return {
        container: 'bg-med-primary/10 border-med-primary/20 text-med-primary',
        dot: 'bg-med-primary',
        pulseShadow: '0 0 0 2px rgba(6, 182, 212, 0.4)'
      }
    case 'purple':
      return {
        container: 'bg-med-purple/10 border-med-purple/20 text-med-purple',
        dot: 'bg-med-purple',
        pulseShadow: '0 0 0 2px rgba(139, 92, 246, 0.4)'
      }
    case 'outline':
      return {
        container: 'bg-transparent border-med-border text-med-text-muted',
        dot: 'bg-med-text-muted',
        pulseShadow: '0 0 0 2px rgba(37, 48, 70, 0.4)'
      }
    default:
      return {
        container: 'bg-med-card-sec border-med-border text-med-text',
        dot: 'bg-med-text',
        pulseShadow: '0 0 0 2px rgba(248, 250, 252, 0.4)'
      }
  }
})
</script>

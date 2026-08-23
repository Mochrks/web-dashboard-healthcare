<template>
  <div
    class="bg-med-card border border-med-border rounded-xl p-4 overflow-hidden flex flex-col gap-2 relative shadow-apple-subtle"
  >
    <!-- Grid overlay and header information -->
    <div class="flex items-center justify-between text-xs font-semibold select-none z-10">
      <div class="flex items-center gap-2">
        <span :style="{ color }" class="font-mono text-sm tracking-wider uppercase font-bold">{{
          label
        }}</span>
        <span class="text-med-text-muted">x1.0</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-med-text-muted">LIVE</span>
        <div
          class="w-2 h-2 rounded-full pulse-status"
          :style="{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }"
        ></div>
      </div>
    </div>

    <!-- Main Canvas Telemetry -->
    <div
      class="relative w-full h-[100px] bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-med-border/50 overflow-hidden"
    >
      <canvas ref="canvasRef" class="w-full h-full block"></canvas>
    </div>

    <!-- Live Telemetry statistics -->
    <div class="flex items-baseline justify-between mt-1 z-10">
      <div class="text-xs text-med-text-muted">
        <span v-if="vitalsType === 'ecg'">PR (BPM)</span>
        <span v-else-if="vitalsType === 'resp'">RR (rpm)</span>
        <span v-else>ABP (mmHg)</span>
      </div>
      <div class="flex items-baseline gap-1 font-mono">
        <span
          :class="[
            'text-3xl font-extrabold tracking-tighter transition-all duration-300',
            isAnomaly ? 'text-med-danger animate-pulse' : ''
          ]"
          :style="{ color: isAnomaly ? undefined : color }"
        >
          {{ displayVal }}
        </span>
        <span class="text-xs text-med-text-muted font-sans font-medium">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRealtimeVitals } from '../../composables/useRealtimeVitals'

const props = defineProps({
  heartRate: { type: Number, default: 72 },
  label: { type: String, default: 'ECG II' },
  color: { type: String, default: '#22C55E' },
  vitalsType: {
    type: String as () => 'ecg' | 'resp' | 'abp',
    default: 'ecg'
  }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const heartRateRef = computed(() => props.heartRate)
const { points } = useRealtimeVitals(heartRateRef, props.vitalsType)

// Display parameters
const displayVal = computed(() => {
  if (props.vitalsType === 'ecg') {
    return props.heartRate
  } else if (props.vitalsType === 'resp') {
    return Math.round(props.heartRate / 4.5) // Respiration rate is about 1/4 to 1/5 of HR
  } else {
    // Blood pressure
    const systolic = Math.round(props.heartRate * 1.1 + 10)
    const diastolic = Math.round(props.heartRate * 0.7 - 2)
    return `${systolic}/${diastolic}`
  }
})

const unit = computed(() => {
  if (props.vitalsType === 'ecg') return 'bpm'
  if (props.vitalsType === 'resp') return 'rpm'
  return 'sys/dia'
})

const isAnomaly = computed(() => {
  if (props.vitalsType === 'ecg') {
    return props.heartRate > 110 || props.heartRate < 55
  }
  return false
})

// Canvas Drawing Loop
let animationFrameId: number
onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Resize canvas for sharp high-DPI displays
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = 100 * dpr
  ctx.scale(dpr, dpr)

  const draw = () => {
    if (!canvas || !ctx) return
    const width = canvas.width / dpr
    const height = 100

    ctx.clearRect(0, 0, width, height)

    // 1. Draw Clinical Millimeter Grid
    const isDark = document.documentElement.classList.contains('dark')
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
    ctx.lineWidth = 0.5

    // Vertical grid lines (every 10px)
    for (let x = 0; x < width; x += 10) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    // Horizontal grid lines (every 10px)
    for (let y = 0; y < height; y += 10) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Heavy grid lines (every 50px)
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'
    ctx.lineWidth = 0.8
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 2. Draw Vitals Waveform
    const pts = points.value
    if (pts.length > 1) {
      ctx.strokeStyle = props.color
      ctx.lineWidth = 2.2
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'

      // Create soft shadows instead of neon glow
      ctx.shadowColor = isDark ? props.color : 'rgba(0,0,0,0.1)'
      ctx.shadowBlur = isDark ? 6 : 4
      ctx.shadowOffsetY = isDark ? 0 : 2

      ctx.beginPath()

      const step = width / 78 // width divided by points buffer size - 2
      const centerY = height / 2

      for (let i = 0; i < pts.length; i++) {
        const x = i * step
        // Invert points so positive is up on screen
        const y = centerY - pts[i] * (height * 0.35)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Reset shadow effects
      ctx.shadowBlur = 0
    }

    animationFrameId = requestAnimationFrame(draw)
  }

  draw()

  // Handle resizing
  const handleResize = () => {
    if (!canvas || !ctx) return
    const r = canvas.getBoundingClientRect()
    canvas.width = r.width * dpr
    canvas.height = 100 * dpr
    ctx.scale(dpr, dpr)
  }
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', handleResize)
  })
})
</script>

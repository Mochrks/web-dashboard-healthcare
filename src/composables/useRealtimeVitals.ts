import { ref, onMounted, onUnmounted } from 'vue'

export function useRealtimeVitals(heartRateRef = ref(75), type: 'ecg' | 'resp' | 'abp' = 'ecg') {
  const points = ref<number[]>(Array(100).fill(0))
  let time = 0
  let intervalId: any = null

  // Generates a single coordinate point for the medical waves
  function getWavePoint(t: number, hr: number): number {
    const bps = hr / 60 // beats per second
    const period = 1 / bps // seconds per beat
    const progress = (t % period) / period // 0 to 1 cycle progress

    if (type === 'ecg') {
      // Classic P-Q-R-S-T Complex Simulation
      if (progress < 0.1) return 0 // flat baseline
      if (progress < 0.18) {
        // P Wave (small upward bump)
        const pProgress = (progress - 0.1) / 0.08
        return Math.sin(pProgress * Math.PI) * 0.15
      }
      if (progress < 0.22) return 0 // PR interval baseline
      if (progress < 0.24) {
        // Q Wave (slight dip)
        const qProgress = (progress - 0.22) / 0.02
        return -qProgress * 0.2
      }
      if (progress < 0.27) {
        // R Wave (tall sharp spike)
        const rProgress = (progress - 0.24) / 0.03
        return -0.2 + rProgress * 1.5 // reaches +1.3
      }
      if (progress < 0.3) {
        // S Wave (sharp deep dip)
        const sProgress = (progress - 0.27) / 0.03
        return 1.3 - sProgress * 1.8 // reaches -0.5
      }
      if (progress < 0.33) {
        // Return to baseline
        const returnProgress = (progress - 0.3) / 0.03
        return -0.5 + returnProgress * 0.5
      }
      if (progress < 0.4) return 0 // ST segment
      if (progress < 0.52) {
        // T Wave (medium rounded upward bump)
        const tProgress = (progress - 0.4) / 0.12
        return Math.sin(tProgress * Math.PI) * 0.35
      }
      return 0 // flat baseline before next beat
    } else if (type === 'resp') {
      // Respiration is a slow, smooth sine wave with minor random noise
      return Math.sin(t * 1.5) * 0.6 + (Math.random() - 0.5) * 0.04
    } else {
      // ABP (Arterial Blood Pressure) Wave: Systolic rapid rise, dicrotic notch, diastolic decline
      if (progress < 0.2) {
        // Systolic upstroke
        const upProgress = progress / 0.2
        return Math.sin((upProgress * Math.PI) / 2) * 0.9
      }
      if (progress < 0.35) {
        // Early decline
        const declProgress = (progress - 0.2) / 0.15
        return 0.9 - declProgress * 0.3 // drops to 0.6
      }
      if (progress < 0.4) {
        // Dicrotic notch bump
        const notchProgress = (progress - 0.35) / 0.05
        return 0.6 + Math.sin(notchProgress * Math.PI) * 0.08
      }
      // Diastolic decay
      const decayProgress = (progress - 0.4) / 0.6
      return 0.6 - decayProgress * 0.4 // falls to 0.2
    }
  }

  function tick() {
    time += 0.033 // 30Hz time step
    const hr = heartRateRef.value
    const newPoint = getWavePoint(time, hr)

    points.value.push(newPoint)
    if (points.value.length > 80) {
      points.value.shift()
    }
  }

  onMounted(() => {
    // Run stream simulation at 30fps
    intervalId = setInterval(tick, 33)
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return {
    points
  }
}

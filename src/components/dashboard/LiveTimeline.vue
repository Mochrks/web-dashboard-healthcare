<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-bold uppercase tracking-wider text-med-text-muted">
        Real-Time Activity Feed
      </h3>
      <span
        class="text-xxs px-2 py-0.5 rounded bg-med-primary/10 text-med-primary animate-pulse font-semibold"
        >LIVE CONNECTED</span
      >
    </div>

    <!-- Timeline Wrapper -->
    <div
      class="relative pl-5 border-l border-med-border flex flex-col gap-5 max-h-[360px] overflow-y-auto pr-1"
    >
      <div
        v-for="item in timelineItems"
        :key="item.id"
        class="relative group transition-all duration-300 hover:pl-1 cursor-default"
      >
        <!-- Timeline Marker Point -->
        <span
          :class="[
            'absolute -left-[26px] top-1.5 w-3 h-3 rounded-full border-2 border-med-bg transition-all duration-300 group-hover:scale-125 z-10',
            markerColors[item.type]
          ]"
        ></span>

        <!-- Event Body -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between gap-4">
            <span class="text-xs font-semibold text-med-text flex items-center gap-1.5">
              <component :is="item.icon" class="w-3.5 h-3.5 text-med-text-muted" />
              {{ item.title }}
            </span>
            <span class="text-[10px] text-med-text-muted font-mono whitespace-nowrap">{{
              item.time
            }}</span>
          </div>
          <p class="text-xxs text-med-text-muted leading-relaxed font-normal">
            {{ item.message }}
          </p>
          <!-- Additional meta for HIPAA or security flag -->
          <div v-if="item.hipaa" class="mt-1 flex items-center gap-1">
            <span
              class="text-[9px] bg-med-danger/10 text-med-danger px-1.5 py-0.5 rounded border border-med-danger/20 font-semibold tracking-wider uppercase"
              >HIPAA AUDIT TRIGGERED</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHospitalStore } from '../../stores/hospitalStore'
import { AlertTriangle, Lock, UserPlus, Info } from 'lucide-vue-next'

const hospitalStore = useHospitalStore()

// Marker coloring mapping
const markerColors: Record<string, string> = {
  alert: 'bg-med-danger',
  security: 'bg-med-purple',
  admission: 'bg-med-primary',
  info: 'bg-med-teal'
}

// Compute timeline items dynamically from Pinia store states
const timelineItems = computed(() => {
  const items: any[] = []

  // 1. Gather active alerts
  hospitalStore.alerts.forEach((alt) => {
    items.push({
      id: alt.id,
      type: alt.level === 'critical' ? 'alert' : 'info',
      title: alt.title,
      message: alt.message,
      time: alt.timestamp,
      icon: alt.level === 'critical' ? AlertTriangle : Info,
      timestampVal: new Date(`1970/01/01 ${alt.timestamp}`).getTime() || Date.now()
    })
  })

  // 2. Gather patient admissions
  hospitalStore.patients.slice(0, 4).forEach((pat) => {
    // Only parse simulated recent admissions
    const parts = pat.admittedAt.split(' ')
    const timeStr = parts.length > 1 ? parts[1] : pat.admittedAt
    items.push({
      id: `adm-${pat.id}`,
      type: 'admission',
      title: 'Triage Admission Intake',
      message: `${pat.name} (${pat.gender}, ${pat.age}) triaged at ${pat.bed} complaining of ${pat.chiefComplaint}.`,
      time: timeStr.length === 5 ? `${timeStr}:00` : timeStr,
      icon: UserPlus,
      timestampVal: new Date(`1970/01/01 ${timeStr}`).getTime() || Date.now()
    })
  })

  // 3. Gather security logs
  hospitalStore.securityLogs.forEach((sec) => {
    items.push({
      id: sec.id,
      type: 'security',
      title: `${sec.action} - ${sec.status}`,
      message: `User ${sec.user} requested resources: ${sec.resource} (IP: ${sec.ipAddress}).`,
      time: sec.timestamp,
      icon: Lock,
      hipaa: sec.hipaaFlag,
      timestampVal: new Date(`1970/01/01 ${sec.timestamp}`).getTime() || Date.now()
    })
  })

  // Sort chronologically (most recent first)
  // Since time format is HH:MM:SS, we can sort by raw timestamp approximation
  return items.sort((a, b) => b.timestampVal - a.timestampVal).slice(0, 8)
})
</script>

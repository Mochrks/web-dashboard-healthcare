<template>
  <div class="flex flex-col gap-6 select-none">
    <!-- Header with server link -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-med-text tracking-tight flex items-center gap-2">
          Clinical Telemetry Central
        </h2>
        <p class="text-xs text-med-text-muted mt-1">
          Multi-channel patient telemetry feeds streaming directly from Bedside Monitors via HL7.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Badge variant="success" :dot="true" :pulse="true">HL7 FEED CONNECTED</Badge>
        <Badge variant="outline">ICU WARD A • 60 FPS</Badge>
      </div>
    </div>

    <!-- Active telemetry grids -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card
        v-for="pat in criticalPatients"
        :key="pat.id"
        :title="`${pat.name} • Bed ${pat.bed}`"
        :subtitle="`MRN: ${pat.mrn} • Age: ${pat.age} • Attending: ${pat.attendingPhysician}`"
        :hover-glow="pat.condition === 'Critical'"
        :hover-glow-danger="pat.condition === 'Critical'"
      >
        <template #title-icon>
          <span
            class="w-2.5 h-2.5 rounded-full animate-pulse"
            :class="
              pat.condition === 'Critical' ? 'bg-med-danger shadow-alert-glow' : 'bg-med-warning'
            "
          ></span>
        </template>
        <template #header-action>
          <div class="flex items-center gap-1.5">
            <Badge :variant="pat.condition === 'Critical' ? 'esi1' : 'esi2'">
              {{ pat.condition }}
            </Badge>
            <Badge variant="outline" class="font-mono">{{ pat.triage }}</Badge>
          </div>
        </template>

        <!-- Dynamic ECG canvas charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <ECGMonitor
            :heart-rate="pat.vitals.heartRate"
            label="ECG II"
            color="#22C55E"
            vitals-type="ecg"
          />
          <ECGMonitor
            :heart-rate="pat.vitals.heartRate"
            label="ART"
            color="#EF4444"
            vitals-type="abp"
          />
        </div>

        <!-- Dynamic vital numbers -->
        <div
          class="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4 bg-neutral-950/30 border border-med-border/40 p-3 rounded-xl text-center select-none font-mono"
        >
          <div class="flex flex-col">
            <span class="text-[9px] text-med-text-muted font-sans font-semibold">HEART RATE</span>
            <span class="text-sm font-bold text-med-success">{{ pat.vitals.heartRate }}</span>
            <span class="text-[8px] text-med-text-muted font-sans font-normal">bpm</span>
          </div>
          <div class="flex flex-col border-l border-med-border/30">
            <span class="text-[9px] text-med-text-muted font-sans font-semibold">BLOOD PRESS</span>
            <span class="text-sm font-bold text-med-danger">
              {{ Math.round(pat.vitals.heartRate * 1.1 + 10) }}/{{
                Math.round(pat.vitals.heartRate * 0.7 - 2)
              }}
            </span>
            <span class="text-[8px] text-med-text-muted font-sans font-normal">mmHg</span>
          </div>
          <div class="flex flex-col border-l border-med-border/30">
            <span class="text-[9px] text-med-text-muted font-sans font-semibold">OXYGEN SAT</span>
            <span class="text-sm font-bold text-med-primary">{{ pat.vitals.oxygenLevel }}%</span>
            <span class="text-[8px] text-med-text-muted font-sans font-normal">SpO2</span>
          </div>
          <div class="flex flex-col border-l border-med-border/30">
            <span class="text-[9px] text-med-text-muted font-sans font-semibold">RESPIRATION</span>
            <span class="text-sm font-bold text-[#A855F7]">{{ pat.vitals.respirationRate }}</span>
            <span class="text-[8px] text-med-text-muted font-sans font-normal">rpm</span>
          </div>
          <div class="flex flex-col border-l border-med-border/30">
            <span class="text-[9px] text-med-text-muted font-sans font-semibold">TEMP</span>
            <span class="text-sm font-bold text-[#F59E0B]">{{ pat.vitals.temperature }}°C</span>
            <span class="text-[8px] text-med-text-muted font-sans font-normal">Core</span>
          </div>
          <div class="flex flex-col border-l border-med-border/30">
            <span class="text-[9px] text-med-text-muted font-sans font-semibold">SEPSIS ONSET</span>
            <span class="text-sm font-bold text-med-purple">{{ pat.sepsisScore }}/10</span>
            <span class="text-[8px] text-med-text-muted font-sans font-normal">qSOFA</span>
          </div>
        </div>

        <!-- Medical devices associated -->
        <div
          class="flex flex-wrap items-center justify-between gap-3 mt-4 text-xxs text-med-text-muted border-t border-med-border/40 pt-4"
        >
          <div class="flex items-center gap-1.5">
            <svg
              class="w-3.5 h-3.5 text-med-teal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            <span>Linked Devices: Ventilator V-441, Infusion Pump P-991</span>
          </div>
          <div class="flex gap-2">
            <Button size="sm" variant="outline" class="text-xxs font-bold py-1 h-7"
              >Mute Alarms</Button
            >
            <router-link :to="`/ai-diagnosis`">
              <Button size="sm" variant="ai" class="text-xxs font-bold py-1 h-7"
                >Clinical Assistant</Button
              >
            </router-link>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHospitalStore } from '../stores/hospitalStore'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import Button from '../components/ui/Button.vue'
import ECGMonitor from '../components/dashboard/ECGMonitor.vue'

const hospitalStore = useHospitalStore()

// Streaming patient cards for only critical or high-risk cases (ICU / Emergency)
const criticalPatients = computed(() => {
  return hospitalStore.patients.filter(
    (p) => p.department === 'ICU' || p.department === 'Emergency'
  )
})
</script>

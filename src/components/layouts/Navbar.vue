<template>
  <nav
    class="bg-med-card/75 backdrop-blur-md border-b border-med-border px-6 py-3.5 flex items-center justify-between select-none sticky top-0 z-30"
  >
    <!-- Mobile Hamburger Toggle and Page Title -->
    <div class="flex items-center gap-4">
      <button
        type="button"
        class="text-med-text-muted hover:text-med-text md:hidden p-1.5 hover:bg-med-card-sec rounded-xl transition-colors outline-none"
        @click="$emit('open-sidebar')"
      >
        <menu-icon class="w-5 h-5" />
      </button>

      <!-- Active Page Indicator Context -->
      <div class="hidden sm:flex flex-col text-left">
        <h1 class="text-sm font-bold text-med-text tracking-tight flex items-center gap-1.5">
          {{ activePageName }}
        </h1>
        <div class="flex items-center gap-1.5 text-[9px] font-mono text-med-text-muted mt-0.5">
          <span>AETHER-CORE</span>
          <span>/</span>
          <span class="text-med-primary">{{ activePageGroup }}</span>
        </div>
      </div>
    </div>

    <!-- Search bar trigger (Ctrl+K) -->
    <div
      class="hidden md:flex items-center gap-2.5 bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-950/30 dark:hover:bg-neutral-950/50 border border-med-border hover:border-med-primary/30 rounded-xl px-4 py-2 text-xs text-med-text-muted hover:text-med-text cursor-pointer transition-all duration-300 w-80 select-none shadow-inner"
      @click="$emit('open-palette')"
    >
      <search class="w-3.5 h-3.5" />
      <span>Search departments, vitals, logs...</span>
      <span
        class="ml-auto text-[9px] bg-med-card-sec px-1.5 py-0.5 rounded border border-med-border tracking-wider font-mono"
        >⌘K</span
      >
    </div>

    <!-- Actions indicators and controls -->
    <div class="flex items-center gap-2.5">
      <!-- Search icon for mobile -->
      <button
        type="button"
        class="md:hidden text-med-text-muted hover:text-med-text p-2 hover:bg-med-card-sec rounded-xl transition-colors outline-none"
        @click="$emit('open-palette')"
      >
        <search class="w-4 h-4" />
      </button>

      <!-- Live Clinical Clock -->
      <div
        class="hidden lg:flex items-center gap-2 bg-neutral-100 dark:bg-neutral-950/20 px-3.5 py-1.5 rounded-xl border border-med-border font-mono text-[10px] text-med-text-muted select-none"
      >
        <clock class="w-3 h-3 text-med-teal" />
        <span>{{ systemTime }}</span>
      </div>

      <!-- Realtime Heartbeat Telemetry Status -->
      <div
        class="hidden xl:flex items-center gap-2 bg-neutral-100 dark:bg-neutral-950/20 px-3.5 py-1.5 rounded-xl border border-med-border text-[9px] text-med-teal font-semibold font-mono select-none"
      >
        <activity class="w-3.5 h-3.5 animate-pulse text-med-primary" />
        <span>FHIR GATEWAY OK (72ms)</span>
      </div>

      <!-- Theme Toggler (Sun/Moon) -->
      <button
        type="button"
        class="bg-med-card-sec border border-med-border text-med-text-muted hover:text-med-text p-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 outline-none"
        @click="toggleTheme"
        title="Toggle Theme"
      >
        <sun v-if="isDark" class="w-4 h-4 text-med-warning" />
        <moon v-else class="w-4 h-4 text-med-primary" />
      </button>

      <!-- Live Alerts Indicator Button -->
      <button
        type="button"
        :class="[
          'relative p-2.5 rounded-xl border transition-all duration-300 outline-none hover:scale-105 active:scale-95',
          activeAlarms > 0
            ? 'bg-med-danger/10 border-med-danger/25 text-med-danger hover:shadow-alert-glow'
            : 'bg-med-card-sec border-med-border text-med-text-muted hover:text-med-text'
        ]"
        @click="$emit('toggle-notifications')"
      >
        <bell class="w-4 h-4" />
        <!-- Red flashing count indicator -->
        <span
          v-if="activeAlarms > 0"
          class="absolute -top-1 -right-1 bg-med-danger text-med-bg text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
        >
          {{ activeAlarms }}
        </span>
      </button>

      <!-- AI Clinical Assistant Panel Button -->
      <button
        type="button"
        class="bg-med-purple hover:bg-med-purple/90 hover:shadow-ai-glow text-med-text p-2.5 rounded-xl flex items-center gap-1.5 border border-med-purple/35 transition-all duration-300 hover:scale-105 active:scale-95 outline-none font-semibold text-xs"
        @click="$emit('toggle-ai')"
      >
        <brain-circuit class="w-4 h-4 animate-pulse" />
        <span class="hidden md:inline">Clinical AI</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHospitalStore } from '../../stores/hospitalStore'
import {
  Menu as MenuIcon,
  Search,
  Bell,
  BrainCircuit,
  Clock,
  Activity,
  Sun,
  Moon
} from 'lucide-vue-next'

const route = useRoute()
const hospitalStore = useHospitalStore()

// Live system simulated clock
const systemTime = ref(new Date().toLocaleTimeString())
let timerId: any = null

const isDark = ref(true)

onMounted(() => {
  timerId = setInterval(() => {
    systemTime.value = new Date().toLocaleTimeString()
  }, 1000)

  isDark.value =
    document.documentElement.className === 'dark' ||
    document.documentElement.classList.contains('dark')
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})

const toggleTheme = () => {
  const html = document.documentElement
  if (html.className === 'dark' || html.classList.contains('dark')) {
    html.className = 'light'
    localStorage.setItem('theme', 'light')
    isDark.value = false
  } else {
    html.className = 'dark'
    localStorage.setItem('theme', 'dark')
    isDark.value = true
  }
}

const activeAlarms = computed(() => hospitalStore.stats.activeCriticalAlerts)

// Map routes dynamically to display title and group
const routeDetails: Record<string, { name: string; group: string }> = {
  '/': { name: 'Executive Operations Dashboard', group: 'Main Command' },
  '/ai-insights': { name: 'AI Operational Insights Center', group: 'Clinical Intelligence' },
  '/realtime-monitor': { name: 'ICU & Emergency Telemetry Realtime', group: 'Telemetry Command' },
  '/patients': { name: 'Patients Census Database', group: 'Patient Management' },
  '/patient-analytics': {
    name: 'Demographics & Length-of-Stay Analytics',
    group: 'Patient Management'
  },
  '/medical-records': { name: 'Electronic Health Records (EHR) Hub', group: 'Patient Management' },
  '/admissions-discharges': {
    name: 'Admissions, Transfers & Discharges (ADT)',
    group: 'Patient Management'
  },
  '/appointments': { name: 'Outpatient Scheduler & Availability', group: 'Patient Management' },
  '/telemedicine': { name: 'Virtual Telehealth Consultation Portal', group: 'Patient Management' },
  '/ai-diagnosis': { name: 'Differential Diagnosis Assistant', group: 'AI Diagnostics' },
  '/medical-imaging': { name: 'Radiology MRI / CT Scan Diagnostic AI', group: 'AI Diagnostics' },
  '/lab-intelligence': { name: 'Hematology & Chemistry Panel Analytics', group: 'AI Diagnostics' },
  '/predictive-risk': { name: 'Sepsis & Decompensation Risk Engine', group: 'AI Diagnostics' },
  '/clinical-decision': {
    name: 'Drug Interactions & Treatment protocols',
    group: 'AI Diagnostics'
  },
  '/bed-management': { name: 'Live Facility Bed Occupancy Map', group: 'Hospital Operations' },
  '/emergency-ops': { name: 'Emergency Room Triage Queue (ESI)', group: 'Hospital Operations' },
  '/surgery-management': {
    name: 'Operating Room (OR) Scheduling & Status',
    group: 'Hospital Operations'
  },
  '/staff-operations': {
    name: 'Clinical Shift Schedules & Burnout Index',
    group: 'Hospital Operations'
  },
  '/facility-monitoring': {
    name: 'HVAC Venting & Clean Air Telemetry',
    group: 'Hospital Operations'
  },
  '/asset-tracking': { name: 'Ventilator & IV Pump RFID Locations', group: 'Hospital Operations' },
  '/pharmacy': { name: 'Critical Formulary & Epinephrine reserves', group: 'Pharmacy & Labs' },
  '/inventory': { name: 'PPE Reserves & Medical Gas Supply Chain', group: 'Pharmacy & Labs' },
  '/lab-operations': {
    name: 'Pathology centrifuges & Specimen pipeline',
    group: 'Pharmacy & Labs'
  },
  '/billing': { name: 'Revenue Cycle Management & Payments', group: 'Finance & Insurance' },
  '/claims': { name: 'Claims Prior-Authorization & Denial Audits', group: 'Finance & Insurance' },
  '/financial-analytics': {
    name: 'Department Budget Cost Margin Logs',
    group: 'Finance & Insurance'
  },
  '/security-center': {
    name: 'HIPAA Gateway Access Logs & Audits',
    group: 'Security & Compliance'
  },
  '/compliance': {
    name: 'Regulatory Accreditations & Policy Renewal',
    group: 'Security & Compliance'
  },
  '/messages': { name: 'Physician secure messaging board', group: 'Communication' },
  '/notifications': { name: 'Operations Notification Alerts Panel', group: 'Communication' },
  '/reports': { name: 'Advanced CSV/FHIR Report Builder', group: 'Administration' },
  '/api-integrations': { name: 'HL7 / FHIR API Webhook integrations', group: 'Administration' },
  '/settings': { name: 'Aether OS System Configuration', group: 'Administration' }
}

const activePageName = computed(() => {
  return routeDetails[route.path]?.name || 'Aether Medical Command'
})

const activePageGroup = computed(() => {
  return routeDetails[route.path]?.group || 'Clinical Intelligence'
})
</script>

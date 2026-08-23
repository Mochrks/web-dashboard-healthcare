<template>
  <nav
    class="bg-pure-white/80 backdrop-blur-md border-b border-mist-gray px-6 py-4 flex items-center justify-between select-none sticky top-0 z-30"
  >
    <!-- Mobile Hamburger Toggle and Page Title -->
    <div class="flex items-center gap-4">
      <button
        type="button"
        class="text-slate-mid hover:text-ink-black md:hidden p-1.5 hover:bg-mist-gray rounded-full transition-colors outline-none"
        @click="$emit('open-sidebar')"
      >
        <menu-icon class="w-5 h-5" />
      </button>

      <!-- Active Page Indicator Context -->
      <div class="hidden sm:flex flex-col text-left">
        <h1
          class="text-sm font-semibold text-ink-black tracking-tight flex items-center gap-1.5 font-sans"
        >
          {{ activePageName }}
        </h1>
        <div
          class="flex items-center gap-1.5 text-[9px] font-mono text-slate-mid mt-0.5 uppercase tracking-widest"
        >
          <span>AETHER-CORE</span>
          <span>/</span>
          <span class="text-forest-grove font-bold">{{ activePageGroup }}</span>
        </div>
      </div>
    </div>

    <!-- Search bar trigger (Ctrl+K) -->
    <div
      class="hidden md:flex items-center gap-2.5 bg-mist-gray hover:bg-mist-gray/80 rounded-full px-4 py-2 text-[13px] text-slate-mid hover:text-ink-black cursor-pointer transition-all duration-300 w-80 select-none border border-transparent hover:border-graphite/10"
      @click="$emit('open-palette')"
    >
      <search class="w-4 h-4 shrink-0" />
      <span class="font-sans truncate flex-1 text-left">Search departments, vitals, logs...</span>
      <span
        class="ml-auto text-[10px] bg-pure-white px-2 py-0.5 rounded-full border border-mist-gray tracking-wider font-mono font-medium text-slate-mid shrink-0"
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
        class="hidden lg:flex items-center gap-2 bg-mist-gray px-3.5 py-1.5 rounded-full border border-transparent font-mono text-[10px] text-slate-mid select-none"
      >
        <clock class="w-3 h-3 text-forest-grove" />
        <span>{{ systemTime }}</span>
      </div>

      <!-- Realtime Heartbeat Telemetry Status -->
      <div
        class="hidden xl:flex items-center gap-2 bg-mist-gray px-3.5 py-1.5 rounded-full border border-transparent text-[9px] text-forest-grove font-semibold font-mono select-none uppercase tracking-widest"
      >
        <activity class="w-3.5 h-3.5 animate-pulse text-forest-grove" />
        <span>FHIR GATEWAY OK</span>
      </div>

      <!-- Theme Toggler (Sun/Moon) -->
      <button
        type="button"
        class="bg-mist-gray text-slate-mid hover:text-ink-black p-2.5 rounded-full transition-all duration-300 outline-none"
        @click="toggleTheme"
        title="Toggle Theme"
      >
        <sun v-if="isDark" class="w-4 h-4 text-warning" />
        <moon v-else class="w-4 h-4 text-forest-grove" />
      </button>

      <!-- Live Alerts Indicator Button -->
      <button
        type="button"
        :class="[
          'relative p-2.5 rounded-full transition-all duration-300 outline-none',
          activeAlarms > 0
            ? 'bg-red-50 text-red-500'
            : 'bg-mist-gray text-slate-mid hover:text-ink-black'
        ]"
        @click="$emit('toggle-notifications')"
      >
        <bell class="w-4 h-4" />
        <!-- Red flashing count indicator -->
        <span
          v-if="activeAlarms > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-sm"
        >
          {{ activeAlarms }}
        </span>
      </button>

      <!-- AI Clinical Assistant Panel Button (Filled Dark Button style) -->
      <button
        type="button"
        class="bg-ink-black hover:bg-pine-shadow text-pure-white px-5 py-2 rounded-full flex items-center gap-2 transition-all duration-300 outline-none font-medium text-[14px] shadow-btn-dark border border-ink-black"
        @click="$emit('toggle-ai')"
      >
        <brain-circuit class="w-4 h-4" />
        <span class="hidden md:inline">Ask Grace AI</span>
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

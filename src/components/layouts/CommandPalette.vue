<template>
  <Dialog
    :is-open="isOpen"
    title="Operational Command Palette"
    subtitle="Search clinical channels, trigger simulations, or jump to departments."
    size="lg"
    @close="$emit('close')"
  >
    <div class="flex flex-col gap-4">
      <!-- Search Input -->
      <div class="relative flex items-center">
        <search class="absolute left-4 w-5 h-5 text-med-text-muted" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Type a department, patient MRN, drug, or shortcut (e.g. 'sepsis', 'beds')..."
          class="w-full bg-med-card-sec border border-med-border focus:border-med-primary rounded-xl py-3 pl-12 pr-4 text-sm text-med-text placeholder-med-text-muted outline-none transition-colors"
          ref="searchInputRef"
          @keydown.down.prevent="moveSelection(1)"
          @keydown.up.prevent="moveSelection(-1)"
          @keydown.enter.prevent="selectActive"
        />
      </div>

      <!-- Action suggestions -->
      <div class="flex flex-col gap-6 mt-2 max-h-[450px] overflow-y-auto pr-1">
        <!-- Search Results (Pages) -->
        <div v-if="filteredItems.length > 0">
          <div class="text-xxs font-bold uppercase tracking-widest text-med-text-muted mb-2 px-2">
            Departments & Clinical Channels ({{ filteredItems.length }})
          </div>
          <div class="flex flex-col gap-1">
            <div
              v-for="(item, idx) in filteredItems"
              :key="item.path"
              :class="[
                'flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer border',
                selectedIdx === idx
                  ? 'bg-med-primary/10 border-med-primary/30 text-med-primary'
                  : 'bg-med-card-sec/45 border-transparent text-med-text hover:bg-med-card-sec/80'
              ]"
              @mouseenter="selectedIdx = idx"
              @click="navigate(item)"
            >
              <div class="flex items-center gap-3">
                <component :is="item.icon" class="w-4 h-4" />
                <div>
                  <span class="text-xs font-semibold">{{ item.name }}</span>
                  <span class="text-xxs text-med-text-muted ml-2 font-normal"
                    >in {{ item.group }}</span
                  >
                </div>
              </div>
              <div
                class="text-xxs text-med-text-muted uppercase font-semibold flex items-center gap-1"
              >
                <span>Jump</span>
                <corner-down-left class="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        <!-- Simulations / Actions -->
        <div>
          <div class="text-xxs font-bold uppercase tracking-widest text-med-text-muted mb-2 px-2">
            AI Operations & Clinic Simulations
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div
              class="p-3 bg-med-card-sec/30 border border-med-border hover:border-med-warning/45 hover:shadow-med-glow rounded-xl flex items-center justify-between cursor-pointer transition-all duration-300 group"
              @click="triggerSimulation('admission')"
            >
              <div class="flex items-center gap-3">
                <activity class="w-4 h-4 text-med-warning" />
                <div class="text-left">
                  <div
                    class="text-xs font-semibold text-med-text group-hover:text-med-warning transition-colors"
                  >
                    Emergency Surge Admission
                  </div>
                  <div class="text-xxs text-med-text-muted">
                    Admit a random critical patient into ER triage
                  </div>
                </div>
              </div>
            </div>

            <div
              class="p-3 bg-med-card-sec/30 border border-med-border hover:border-med-teal/45 hover:shadow-teal-glow rounded-xl flex items-center justify-between cursor-pointer transition-all duration-300 group"
              @click="triggerSimulation('clear-alerts')"
            >
              <div class="flex items-center gap-3">
                <check-circle-2 class="w-4 h-4 text-med-teal" />
                <div class="text-left">
                  <div
                    class="text-xs font-semibold text-med-text group-hover:text-med-teal transition-colors"
                  >
                    Clear Clinical Alarms
                  </div>
                  <div class="text-xxs text-med-text-muted">Acknowledge all active ICU alarms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Palette Footer shortcuts -->
      <div
        class="flex items-center gap-4 text-xxs text-med-text-muted border-t border-med-border pt-4 px-1 mt-1"
      >
        <span class="flex items-center gap-1"
          ><kbd class="bg-med-card-sec px-1.5 py-0.5 rounded border border-med-border">↑↓</kbd>
          Navigate</span
        >
        <span class="flex items-center gap-1"
          ><kbd class="bg-med-card-sec px-1.5 py-0.5 rounded border border-med-border">Enter</kbd>
          Select</span
        >
        <span class="flex items-center gap-1"
          ><kbd class="bg-med-card-sec px-1.5 py-0.5 rounded border border-med-border">ESC</kbd>
          Close</span
        >
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useHospitalStore } from '../../stores/hospitalStore'
import Dialog from '../ui/Dialog.vue'
import {
  Search,
  CornerDownLeft,
  Activity,
  CheckCircle2,
  LayoutDashboard,
  BrainCircuit,
  ActivitySquare,
  Users,
  LineChart,
  FileText,
  DoorOpen,
  Calendar,
  Video,
  Stethoscope,
  FileHeart,
  ShieldAlert,
  Hotel,
  AlertTriangle,
  Scissors,
  UserSquare2,
  ThermometerSun,
  Compass,
  Pill,
  PackageCheck,
  ClipboardCheck,
  Landmark,
  Receipt,
  BarChart3,
  Lock,
  MessageSquareDashed,
  Bell,
  FileSpreadsheet,
  Webhook,
  Settings
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, required: true }
})

const emit = defineEmits(['close'])
const router = useRouter()
const hospitalStore = useHospitalStore()

const searchQuery = ref('')
const selectedIdx = ref(0)
const searchInputRef = ref<HTMLInputElement | null>(null)

// Static list of all 33 pages matching our layout router mapping
const palettePages = [
  // MAIN
  { name: 'Executive Dashboard', path: '/', group: 'Main', icon: LayoutDashboard },
  { name: 'AI Insights Center', path: '/ai-insights', group: 'Main', icon: BrainCircuit },
  { name: 'Realtime Monitoring', path: '/realtime-monitor', group: 'Main', icon: ActivitySquare },
  // PATIENT MANAGEMENT
  { name: 'Patients Database', path: '/patients', group: 'Patient Management', icon: Users },
  {
    name: 'Patient Analytics',
    path: '/patient-analytics',
    group: 'Patient Management',
    icon: LineChart
  },
  {
    name: 'Medical Records (EHR)',
    path: '/medical-records',
    group: 'Patient Management',
    icon: FileText
  },
  {
    name: 'Admissions & Discharges',
    path: '/admissions-discharges',
    group: 'Patient Management',
    icon: DoorOpen
  },
  {
    name: 'Appointments Planner',
    path: '/appointments',
    group: 'Patient Management',
    icon: Calendar
  },
  { name: 'Telemedicine Panel', path: '/telemedicine', group: 'Patient Management', icon: Video },
  // AI DIAGNOSTICS
  {
    name: 'AI Diagnosis Assistant',
    path: '/ai-diagnosis',
    group: 'AI Diagnostics',
    icon: Stethoscope
  },
  {
    name: 'Medical Imaging AI (DICOM)',
    path: '/medical-imaging',
    group: 'AI Diagnostics',
    icon: FileHeart
  },
  {
    name: 'Lab Intelligence Panel',
    path: '/lab-intelligence',
    group: 'AI Diagnostics',
    icon: ClipboardCheck
  },
  {
    name: 'Predictive Risk Engine',
    path: '/predictive-risk',
    group: 'AI Diagnostics',
    icon: ShieldAlert
  },
  {
    name: 'Clinical Decision Support',
    path: '/clinical-decision',
    group: 'AI Diagnostics',
    icon: BrainCircuit
  },
  // HOSPITAL OPERATIONS
  {
    name: 'Bed Management Map',
    path: '/bed-management',
    group: 'Hospital Operations',
    icon: Hotel
  },
  {
    name: 'Emergency Operations (Triage)',
    path: '/emergency-ops',
    group: 'Hospital Operations',
    icon: AlertTriangle
  },
  {
    name: 'Surgery Suite Control (OR)',
    path: '/surgery-management',
    group: 'Hospital Operations',
    icon: Scissors
  },
  {
    name: 'Staff Operations & Burnout',
    path: '/staff-operations',
    group: 'Hospital Operations',
    icon: UserSquare2
  },
  {
    name: 'Smart Facility Telemetry',
    path: '/facility-monitoring',
    group: 'Hospital Operations',
    icon: ThermometerSun
  },
  {
    name: 'Asset RFID Tracking',
    path: '/asset-tracking',
    group: 'Hospital Operations',
    icon: Compass
  },
  // PHARMACY & LABS
  { name: 'Pharmacy Dispensing', path: '/pharmacy', group: 'Pharmacy & Labs', icon: Pill },
  { name: 'Inventory Reserves', path: '/inventory', group: 'Pharmacy & Labs', icon: PackageCheck },
  {
    name: 'Laboratory Logs',
    path: '/lab-operations',
    group: 'Pharmacy & Labs',
    icon: ClipboardCheck
  },
  // FINANCE & INSURANCE
  {
    name: 'Billing & Payments Control',
    path: '/billing',
    group: 'Finance & Insurance',
    icon: Landmark
  },
  {
    name: 'Insurance Claims Auditing',
    path: '/claims',
    group: 'Finance & Insurance',
    icon: Receipt
  },
  {
    name: 'Financial Analytics Summary',
    path: '/financial-analytics',
    group: 'Finance & Insurance',
    icon: BarChart3
  },
  // SECURITY & COMPLIANCE
  { name: 'Security Center', path: '/security-center', group: 'Security & Compliance', icon: Lock },
  {
    name: 'Compliance & Audit Trail',
    path: '/compliance',
    group: 'Security & Compliance',
    icon: Landmark
  },
  // COMMUNICATION
  {
    name: 'Messages & Collaboration',
    path: '/messages',
    group: 'Communication',
    icon: MessageSquareDashed
  },
  { name: 'Notifications Center Feed', path: '/notifications', group: 'Communication', icon: Bell },
  // ADMINISTRATION
  {
    name: 'Reports & Analytics Builder',
    path: '/reports',
    group: 'Administration',
    icon: FileSpreadsheet
  },
  { name: 'API FHIR Webhooks', path: '/api-integrations', group: 'Administration', icon: Webhook },
  { name: 'Settings & Configurations', path: '/settings', group: 'Administration', icon: Settings }
]

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return palettePages.slice(0, 8) // default show first 8 pages

  return palettePages.filter(
    (p) => p.name.toLowerCase().includes(query) || p.group.toLowerCase().includes(query)
  )
})

// Watch filtering to reset selected index
watch(filteredItems, () => {
  selectedIdx.value = 0
})

// Auto-focus search input when opened
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        searchInputRef.value?.focus()
      })
    } else {
      searchQuery.value = ''
    }
  }
)

function moveSelection(direction: number) {
  const len = filteredItems.value.length
  if (len === 0) return
  selectedIdx.value = (selectedIdx.value + direction + len) % len
}

function selectActive() {
  const activeItem = filteredItems.value[selectedIdx.value]
  if (activeItem) {
    navigate(activeItem)
  }
}

function navigate(item: (typeof palettePages)[0]) {
  router.push(item.path)
  emit('close')
}

function triggerSimulation(type: 'admission' | 'clear-alerts') {
  if (type === 'admission') {
    // Manually force store updates to trigger an admission immediately
    const prevCount = hospitalStore.patients.length
    let attempts = 0

    // Call updates multiple times until an admission is triggered
    while (hospitalStore.patients.length === prevCount && attempts < 20) {
      hospitalStore.simulateRealtimeUpdates()
      attempts++
    }
  } else if (type === 'clear-alerts') {
    hospitalStore.acknowledgeAllAlerts()
  }
  emit('close')
}
</script>

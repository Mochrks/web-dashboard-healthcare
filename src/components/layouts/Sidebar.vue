<template>
  <div
    class="flex flex-col h-full bg-med-card border-r border-med-border text-med-text select-none"
  >
    <!-- Brand Logo header -->
    <div class="px-6 py-5 border-b border-med-border flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-xl bg-med-primary flex items-center justify-center shadow-med-glow"
        >
          <Hospital class="w-4 h-4 text-white" />
        </div>
        <div class="flex flex-col text-left">
          <span class="text-xs font-extrabold tracking-tight text-med-text">AETHER HEALTH</span>
          <span class="text-[9px] text-med-purple font-mono uppercase tracking-wider font-bold"
            >Clinical OS v3.5</span
          >
        </div>
      </div>

      <!-- Close button on Mobile drawer -->
      <button
        v-if="isMobile"
        type="button"
        class="text-med-text-muted hover:text-med-text md:hidden p-1 hover:bg-med-card-sec rounded"
        @click="$emit('close-sidebar')"
      >
        <x class="w-4 h-4" />
      </button>
    </div>

    <!-- Navigation Scrollable List -->
    <div class="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 scrollbar-thin">
      <div v-for="group in menuGroups" :key="group.name" class="flex flex-col">
        <!-- Group Header Toggle -->
        <button
          type="button"
          class="flex items-center justify-between w-full py-1.5 px-2.5 text-[10px] font-bold text-med-text-muted hover:text-med-text uppercase tracking-widest outline-none transition-colors mb-1 rounded-md hover:bg-med-card-sec/40"
          @click="toggleGroup(group.name)"
        >
          <span>{{ group.name }}</span>
          <component
            :is="isGroupCollapsed(group.name) ? ChevronRight : ChevronDown"
            class="w-3 h-3 text-med-text-muted"
          />
        </button>

        <!-- Group Nested Navigation Items -->
        <transition name="sidebar-slide">
          <div
            v-show="!isGroupCollapsed(group.name)"
            class="flex flex-col gap-0.5 pl-1.5 overflow-hidden transition-all duration-300"
          >
            <router-link
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              v-slot="{ isActive, navigate }"
              custom
            >
              <div
                :class="[
                  'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border transition-all duration-200 outline-none',
                  isActive
                    ? 'bg-med-primary/10 border-med-primary/20 text-med-primary shadow-sm'
                    : 'border-transparent text-med-text-muted hover:text-med-text hover:bg-med-card-sec/70'
                ]"
                @click="handleNav(navigate)"
              >
                <div class="flex items-center gap-2.5">
                  <component :is="item.icon" class="w-3.5 h-3.5" />
                  <span>{{ item.label }}</span>
                </div>

                <!-- Badge for warning metrics (e.g. Sepsis warnings or live counts) -->
                <span
                  v-if="item.alertCount > 0"
                  class="bg-med-danger/10 border border-med-danger/25 text-med-danger font-mono text-[9px] px-1.5 py-0.5 rounded-md animate-pulse font-bold"
                >
                  {{ item.alertCount }}
                </span>
              </div>
            </router-link>
          </div>
        </transition>
      </div>
    </div>

    <!-- Active Doctor Profile Footer -->
    <div
      class="p-4 border-t border-med-border bg-med-card-sec/30 dark:bg-neutral-950/30 flex items-center justify-between select-none"
    >
      <div class="flex items-center gap-2.5">
        <div class="relative">
          <div
            class="w-8 h-8 rounded-full bg-med-card-sec border border-med-border flex items-center justify-center font-bold text-xs text-med-teal uppercase"
          >
            RC
          </div>
          <span
            class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-med-success border-2 border-med-bg"
          ></span>
        </div>
        <div class="flex flex-col text-left">
          <span class="text-xs font-semibold text-med-text">Dr. Evelyn Carter</span>
          <span class="text-[10px] text-med-text-muted font-normal">Attending Physician (ED)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHospitalStore } from '../../stores/hospitalStore'
import {
  ChevronRight,
  ChevronDown,
  X,
  Hospital,
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

defineProps({
  isMobile: { type: Boolean, default: false }
})

const emit = defineEmits(['close-sidebar'])
const hospitalStore = useHospitalStore()

// Track Collapsible Sidebar States per Nav Group
const collapsedGroups = ref<Record<string, boolean>>({
  'Main Dashboard': false,
  'Patient Management': true,
  'AI Diagnostics': true,
  'Hospital Operations': true,
  'Pharmacy & Labs': true,
  'Finance & Insurance': true,
  'Security & Compliance': true,
  'Communication Channel': true,
  'Administration Core': true
})

function isGroupCollapsed(name: string): boolean {
  return collapsedGroups.value[name] ?? false
}

function toggleGroup(name: string) {
  collapsedGroups.value[name] = !collapsedGroups.value[name]
}

function handleNav(navigate: () => void) {
  navigate()
  emit('close-sidebar')
}

// Compute active alarm warnings dynamically
const activeAlarms = computed(() => hospitalStore.stats.activeCriticalAlerts)

const menuGroups = computed(() => [
  {
    name: 'Main Dashboard',
    items: [
      { label: 'Executive Dashboard', path: '/', icon: LayoutDashboard, alertCount: 0 },
      { label: 'AI Insights Center', path: '/ai-insights', icon: BrainCircuit, alertCount: 0 },
      {
        label: 'Realtime Monitoring',
        path: '/realtime-monitor',
        icon: ActivitySquare,
        alertCount: activeAlarms.value
      }
    ]
  },
  {
    name: 'Patient Management',
    items: [
      { label: 'Patients', path: '/patients', icon: Users, alertCount: 0 },
      { label: 'Patient Analytics', path: '/patient-analytics', icon: LineChart, alertCount: 0 },
      { label: 'Medical Records', path: '/medical-records', icon: FileText, alertCount: 0 },
      {
        label: 'Admissions & Discharges',
        path: '/admissions-discharges',
        icon: DoorOpen,
        alertCount: 0
      },
      { label: 'Appointments', path: '/appointments', icon: Calendar, alertCount: 0 },
      { label: 'Telemedicine', path: '/telemedicine', icon: Video, alertCount: 0 }
    ]
  },
  {
    name: 'AI Diagnostics',
    items: [
      { label: 'AI Diagnosis Assistant', path: '/ai-diagnosis', icon: Stethoscope, alertCount: 0 },
      { label: 'Medical Imaging AI', path: '/medical-imaging', icon: FileHeart, alertCount: 0 },
      { label: 'Lab Intelligence', path: '/lab-intelligence', icon: ClipboardCheck, alertCount: 0 },
      {
        label: 'Predictive Risk Engine',
        path: '/predictive-risk',
        icon: ShieldAlert,
        alertCount: 0
      },
      {
        label: 'Clinical Decision Support',
        path: '/clinical-decision',
        icon: BrainCircuit,
        alertCount: 0
      }
    ]
  },
  {
    name: 'Hospital Operations',
    items: [
      { label: 'Bed Management', path: '/bed-management', icon: Hotel, alertCount: 0 },
      { label: 'Emergency Operations', path: '/emergency-ops', icon: AlertTriangle, alertCount: 0 },
      { label: 'Surgery Management', path: '/surgery-management', icon: Scissors, alertCount: 0 },
      { label: 'Staff Operations', path: '/staff-operations', icon: UserSquare2, alertCount: 0 },
      {
        label: 'Smart Facility Monitoring',
        path: '/facility-monitoring',
        icon: ThermometerSun,
        alertCount: 0
      },
      { label: 'Asset Tracking', path: '/asset-tracking', icon: Compass, alertCount: 0 }
    ]
  },
  {
    name: 'Pharmacy & Labs',
    items: [
      { label: 'Pharmacy Management', path: '/pharmacy', icon: Pill, alertCount: 0 },
      { label: 'Inventory Management', path: '/inventory', icon: PackageCheck, alertCount: 0 },
      {
        label: 'Laboratory Operations',
        path: '/lab-operations',
        icon: ClipboardCheck,
        alertCount: 0
      }
    ]
  },
  {
    name: 'Finance & Insurance',
    items: [
      { label: 'Billing & Payments', path: '/billing', icon: Landmark, alertCount: 0 },
      { label: 'Insurance Claims', path: '/claims', icon: Receipt, alertCount: 0 },
      { label: 'Financial Analytics', path: '/financial-analytics', icon: BarChart3, alertCount: 0 }
    ]
  },
  {
    name: 'Security & Compliance',
    items: [
      { label: 'Security Center', path: '/security-center', icon: Lock, alertCount: 0 },
      { label: 'Compliance & Audit', path: '/compliance', icon: Landmark, alertCount: 0 }
    ]
  },
  {
    name: 'Communication Channel',
    items: [
      {
        label: 'Messages & Collaboration',
        path: '/messages',
        icon: MessageSquareDashed,
        alertCount: 0
      },
      { label: 'Notifications Center', path: '/notifications', icon: Bell, alertCount: 0 }
    ]
  },
  {
    name: 'Administration Core',
    items: [
      { label: 'Reports & Analytics', path: '/reports', icon: FileSpreadsheet, alertCount: 0 },
      { label: 'API & Integrations', path: '/api-integrations', icon: Webhook, alertCount: 0 },
      { label: 'Settings', path: '/settings', icon: Settings, alertCount: 0 }
    ]
  }
])
</script>

<style scoped>
.sidebar-slide-enter-active {
  transition: max-height 0.3s ease-out;
  max-height: 250px;
}
.sidebar-slide-leave-active {
  transition: max-height 0.2s ease-in;
  max-height: 250px;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  max-height: 0;
}
</style>

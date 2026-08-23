<template>
  <div
    class="flex flex-col h-full bg-pure-white border-r border-mist-gray text-ink-black select-none"
  >
    <!-- Brand Logo header -->
    <div
      :class="[
        'py-5 border-b border-mist-gray flex items-center transition-all',
        collapsed ? 'flex-col gap-4 justify-center px-0' : 'px-6 justify-between'
      ]"
    >
      <div class="flex items-center gap-2.5 justify-center">
        <div
          class="w-8 h-8 rounded-full bg-mist-gray flex items-center justify-center border border-graphite/10 shrink-0 mx-auto"
        >
          <Hospital class="w-4 h-4 text-forest-grove" />
        </div>
        <div class="flex flex-col text-left truncate" v-if="!collapsed">
          <span class="text-xs font-bold tracking-tight text-ink-black font-sans truncate"
            >AETHER HEALTH</span
          >
          <span
            class="text-[9px] text-forest-grove font-mono uppercase tracking-wider font-semibold truncate"
            >Clinical OS v3.5</span
          >
        </div>
      </div>

      <!-- Collapse Toggle Button (Desktop) -->
      <button
        v-if="!isMobile"
        type="button"
        :class="[
          'text-slate-mid hover:text-ink-black p-1.5 hover:bg-mist-gray rounded-full transition-colors',
          collapsed ? 'mx-auto' : 'ml-auto'
        ]"
        @click="$emit('toggle-collapse')"
        :title="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
      >
        <panel-left-close v-if="!collapsed" class="w-4 h-4" />
        <panel-left-open v-else class="w-4 h-4" />
      </button>

      <!-- Close button on Mobile drawer -->
      <button
        v-if="isMobile"
        type="button"
        class="text-slate-mid hover:text-ink-black md:hidden p-1 hover:bg-mist-gray rounded-full"
        @click="$emit('close-sidebar')"
      >
        <x class="w-4 h-4" />
      </button>
    </div>

    <!-- Navigation Scrollable List -->
    <div
      :class="[
        'flex-1 overflow-y-auto py-6 flex flex-col gap-4 scrollbar-thin',
        collapsed ? 'px-2' : 'px-4'
      ]"
    >
      <div v-for="group in menuGroups" :key="group.name" class="flex flex-col">
        <!-- Group Header Toggle -->
        <button
          v-if="!collapsed"
          type="button"
          class="flex items-center justify-between w-full py-1.5 px-2.5 text-[10px] font-bold text-slate-mid hover:text-ink-black uppercase tracking-widest outline-none transition-colors mb-1 rounded-md hover:bg-mist-gray/40"
          @click="toggleGroup(group.name)"
        >
          <span>{{ group.name }}</span>
          <component
            :is="isGroupCollapsed(group.name) ? ChevronRight : ChevronDown"
            class="w-3 h-3 text-slate-mid"
          />
        </button>
        <div v-else class="h-4"></div>
        <!-- Spacer when collapsed -->

        <!-- Group Nested Navigation Items -->
        <transition name="sidebar-slide">
          <div
            v-show="collapsed || !isGroupCollapsed(group.name)"
            class="flex flex-col gap-1 overflow-hidden transition-all duration-300 mt-1"
            :class="collapsed ? 'px-0' : 'pl-1.5'"
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
                  'flex items-center rounded-full text-[13px] font-medium cursor-pointer transition-all duration-200 outline-none relative group',
                  collapsed ? 'justify-center mx-auto w-10 h-10 px-0' : 'justify-between px-3 py-2',
                  isActive
                    ? 'bg-mist-gray text-ink-black shadow-sm border border-graphite/5'
                    : 'text-slate-mid hover:text-ink-black hover:bg-mist-gray'
                ]"
                @click="handleNav(navigate)"
                @mouseenter="showTooltip($event, item.label)"
                @mouseleave="hideTooltip"
              >
                <div :class="['flex items-center', collapsed ? 'justify-center' : 'gap-3']">
                  <component :is="item.icon" class="w-4 h-4 shrink-0" />
                  <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
                </div>

                <!-- Badge for warning metrics -->
                <span
                  v-if="item.alertCount > 0 && !collapsed"
                  class="bg-red-50 text-red-500 font-mono text-[10px] px-2 py-0.5 rounded-full animate-pulse font-bold"
                >
                  {{ item.alertCount }}
                </span>
                <span
                  v-if="item.alertCount > 0 && collapsed"
                  class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-pure-white rounded-full animate-pulse"
                ></span>
              </div>
            </router-link>
          </div>
        </transition>
      </div>
    </div>

    <!-- Active Doctor Profile Footer -->
    <div
      class="p-4 border-t border-mist-gray bg-pure-white flex items-center justify-between select-none relative"
    >
      <div
        :class="[
          'flex items-center cursor-pointer hover:bg-mist-gray p-1.5 rounded-xl transition-colors w-full group',
          collapsed ? 'justify-center' : 'gap-2.5'
        ]"
        @click="showUserMenu = !showUserMenu"
      >
        <div class="relative shrink-0">
          <div
            class="w-8 h-8 rounded-full bg-mist-gray border border-mist-gray flex items-center justify-center font-bold text-xs text-forest-grove uppercase"
          >
            RC
          </div>
          <span
            class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-forest-grove border-[1.5px] border-pure-white group-hover:border-mist-gray transition-colors"
          ></span>
        </div>
        <div class="flex flex-col text-left truncate" v-if="!collapsed">
          <span class="text-xs font-semibold text-ink-black font-sans truncate"
            >Dr. Evelyn Carter</span
          >
          <span class="text-[10px] text-slate-mid font-normal truncate"
            >Attending Physician (ED)</span
          >
        </div>
      </div>

      <!-- User Menu Popover -->
      <transition name="fade">
        <div
          v-if="showUserMenu"
          :class="[
            'absolute bottom-16 bg-pure-white border border-mist-gray rounded-xl shadow-floating py-2 z-50 flex flex-col',
            collapsed ? 'left-full ml-4 w-48' : 'left-4 right-4'
          ]"
        >
          <button
            class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-ink-black hover:bg-mist-gray text-left w-full transition-colors"
          >
            <user-cog class="w-4 h-4 text-slate-mid" />
            Account Settings
          </button>
          <div class="h-px bg-mist-gray w-full my-1"></div>
          <button
            class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 text-left w-full transition-colors"
          >
            <log-out class="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </transition>
    </div>
    <!-- Teleported Custom Tooltip -->
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="activeTooltip.show"
          class="fixed z-[100] px-2.5 py-1.5 bg-ink-black text-pure-white text-[11px] font-semibold rounded-md whitespace-nowrap shadow-floating pointer-events-none"
          :style="{ top: activeTooltip.top + 'px', left: '90px', transform: 'translateY(-50%)' }"
        >
          {{ activeTooltip.label }}
        </div>
      </transition>
    </teleport>
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
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  UserCog
} from 'lucide-vue-next'

const props = defineProps({
  isMobile: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['close-sidebar', 'toggle-collapse'])
const hospitalStore = useHospitalStore()

const showUserMenu = ref(false)

// Custom Tooltip State
const activeTooltip = ref({ show: false, label: '', top: 0 })

function showTooltip(e: MouseEvent, label: string) {
  if (!props.collapsed) return
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  activeTooltip.value = {
    show: true,
    label,
    top: rect.top + rect.height / 2
  }
}

function hideTooltip() {
  activeTooltip.value.show = false
}

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

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>

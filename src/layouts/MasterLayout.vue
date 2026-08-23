<template>
  <div class="min-h-screen bg-pure-white text-ink-black font-sans flex relative overflow-hidden">
    <!-- Desktop Sidebar (Hidden on mobile/tablet) -->
    <aside
      :class="[
        'hidden md:block flex-shrink-0 h-screen sticky top-0 transition-all duration-300 z-40',
        isDesktopSidebarCollapsed ? 'w-20' : 'w-64 xl:w-72'
      ]"
    >
      <Sidebar
        :collapsed="isDesktopSidebarCollapsed"
        @toggle-collapse="isDesktopSidebarCollapsed = !isDesktopSidebarCollapsed"
      />
    </aside>

    <!-- Mobile Sidebar Drawer Overlay -->
    <transition name="drawer-fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        @click="isSidebarOpen = false"
      ></div>
    </transition>

    <!-- Mobile Sidebar Drawer Content -->
    <transition name="drawer-slide">
      <aside v-if="isSidebarOpen" class="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
        <Sidebar :is-mobile="true" @close-sidebar="isSidebarOpen = false" />
      </aside>
    </transition>

    <!-- Main Workspace (Navbar + Page Contents) -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
      <Navbar
        @open-sidebar="isSidebarOpen = true"
        @open-palette="isPaletteOpen = true"
        @toggle-notifications="isNotificationsOpen = true"
        @toggle-ai="isAiOpen = !isAiOpen"
      />

      <!-- Primary Router View Container -->
      <main class="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 bg-mist-gray">
        <router-view v-slot="{ Component }">
          <transition name="route-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Global Command Palette Dialog -->
    <CommandPalette :is-open="isPaletteOpen" @close="isPaletteOpen = false" />

    <!-- Global Notifications Side Sheet -->
    <Sheet
      :is-open="isNotificationsOpen"
      title="Alerts & Notification Feed"
      subtitle="Review critical clinical warnings, and operational anomaly streams."
      @close="isNotificationsOpen = false"
    >
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center select-none mb-2">
          <span class="text-xs text-med-text-muted"
            >Unacknowledged Warnings ({{ activeAlarms.length }})</span
          >
          <button
            v-if="activeAlarms.length > 0"
            type="button"
            class="text-xxs font-bold text-med-teal hover:text-med-teal/80 transition-colors"
            @click="hospitalStore.acknowledgeAllAlerts"
          >
            Acknowledge All
          </button>
        </div>

        <div
          v-if="activeAlarms.length === 0"
          class="py-12 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-med-border rounded-2xl bg-med-card-sec/30"
        >
          <check-circle class="w-8 h-8 text-med-teal animate-pulse" />
          <div>
            <div class="text-xs font-semibold text-med-text">All Systems Nominal</div>
            <div class="text-xxs text-med-text-muted mt-0.5">
              No unacknowledged operational alarms found.
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col gap-2.5">
          <div
            v-for="alt in activeAlarms"
            :key="alt.id"
            :class="[
              'p-4 rounded-xl border flex flex-col gap-2 relative transition-all duration-300',
              alt.level === 'critical'
                ? 'bg-med-danger/5 border-med-danger/20 hover:border-med-danger/45 hover:shadow-alert-glow'
                : 'bg-med-warning/5 border-med-warning/20 hover:border-med-warning/45 hover:shadow-med-glow'
            ]"
          >
            <div class="flex items-start justify-between gap-4">
              <span
                class="text-xs font-bold text-med-text tracking-tight flex items-center gap-1.5"
              >
                <span
                  class="w-2 h-2 rounded-full animate-ping"
                  :class="alt.level === 'critical' ? 'bg-med-danger' : 'bg-med-warning'"
                ></span>
                {{ alt.title }}
              </span>
              <span class="text-[9px] text-med-text-muted font-mono">{{ alt.timestamp }}</span>
            </div>

            <p class="text-xxs text-med-text-muted leading-relaxed">{{ alt.message }}</p>

            <div
              v-if="alt.aiSuggestedAction"
              class="bg-black/25 p-2.5 rounded-lg border border-med-purple/10 flex flex-col gap-1 mt-1 text-left"
            >
              <span class="text-[9px] font-bold text-med-purple uppercase tracking-wider"
                >AI Recommended Response</span
              >
              <span class="text-xxs text-med-text-muted leading-relaxed font-sans">{{
                alt.aiSuggestedAction
              }}</span>
            </div>

            <div class="flex justify-end mt-1">
              <button
                type="button"
                class="text-[10px] font-bold px-3 py-1 rounded bg-med-card border border-med-border hover:border-med-primary/30 text-med-text transition-all duration-200 outline-none"
                @click="hospitalStore.acknowledgeAlert(alt.id)"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      </div>
    </Sheet>

    <!-- Global Persistent Clinical AI Consultation Sheet -->
    <Sheet
      :is-open="isAiOpen"
      title="Aether Clinical AI"
      subtitle="Realtime medical analytics & diagnostic assistance panel."
      @close="isAiOpen = false"
    >
      <AiAssistantPanel />
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHospitalStore } from '../stores/hospitalStore'
import Sidebar from '../components/layouts/Sidebar.vue'
import Navbar from '../components/layouts/Navbar.vue'
import CommandPalette from '../components/layouts/CommandPalette.vue'
import Sheet from '../components/ui/Sheet.vue'
import AiAssistantPanel from '../components/dashboard/AiAssistantPanel.vue'
import { CheckCircle } from 'lucide-vue-next'

const hospitalStore = useHospitalStore()

const isSidebarOpen = ref(false)
const isDesktopSidebarCollapsed = ref(false)
const isPaletteOpen = ref(false)
const isNotificationsOpen = ref(false)
const isAiOpen = ref(false)

const activeAlarms = computed(() => hospitalStore.alerts.filter((a) => !a.acknowledged))

// Periodic Telemetry Simulator (runs every 8-10 seconds)
let intervalId: any = null

onMounted(() => {
  // Bind global keyboard shortcut Ctrl+K / Cmd+K to trigger Command Palette
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      isPaletteOpen.value = true
    }
  }
  window.addEventListener('keydown', handleKeyDown)

  // Initialize store simulation interval
  intervalId = setInterval(() => {
    hospitalStore.simulateRealtimeUpdates()
  }, 10000)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    if (intervalId) clearInterval(intervalId)
  })
})
</script>

<style scoped>
/* Mobile Drawer Fade backdrop */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

/* Mobile Drawer Slide list */
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(-100%);
}

/* Page Route Fade Transitions */
.route-fade-enter-active,
.route-fade-leave-active {
  transition: all 0.2s ease-out;
}
.route-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.route-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader
      title="Admissions & Discharges"
      description="Admissions, Transfers & Discharges (ADT)"
    >
      <template #icon><Activity class="w-6 h-6 text-med-primary" /></template>
      <template #actions>
        <Badge variant="stable" :dot="true" :pulse="true">System Nominal</Badge>
      </template>
    </PageHeader>

    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-med-card border border-med-border p-4 rounded-[18px]"
    >
      <div class="relative flex items-center flex-1 max-w-md">
        <Search class="absolute left-3 w-4 h-4 text-med-text-muted" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search records..."
          class="w-full bg-neutral-50 dark:bg-neutral-900 border border-med-border/50 focus:border-med-primary rounded-xl py-2 pl-10 pr-4 text-xs text-med-text placeholder-med-text-muted outline-none transition-colors"
        />
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <Button size="sm" variant="outline">
          <Filter class="w-3.5 h-3.5" />
          <span>Filters</span>
        </Button>
        <Button size="sm" variant="outline" @click="triggerRefresh" :loading="isRefreshing">
          <RefreshCw class="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
        </Button>
      </div>
    </div>

    <div v-if="isRefreshing" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card v-for="n in 3" :key="n" :loading="true" class="h-64"></Card>
    </div>

    <div v-else class="flex flex-col gap-6 transition-all duration-300">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Today's Admissions" subtitle="Inbound patients">
          <template #title-icon><user-plus class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">
            {{ hospitalStore.stats.dailyAdmissions }}
          </div>
        </Card>
        <Card title="Today's Discharges" subtitle="Cleared for exit">
          <template #title-icon><door-open class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">
            {{ hospitalStore.stats.dailyDischarges }}
          </div>
        </Card>
        <Card title="Ambulances En Route" subtitle="Incoming transport">
          <template #title-icon
            ><alert-triangle class="w-4 h-4 text-med-danger animate-pulse"
          /></template>
          <div class="text-3xl font-extrabold text-med-danger font-mono mt-2">2</div>
        </Card>
        <Card title="Bed Turnaround" subtitle="Avg cleaning cycle">
          <template #title-icon><clock class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">38m</div>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Incoming Transfer Queue" subtitle="Ambulance and inter-facility transfers">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              class="p-3.5 bg-med-danger/5 border border-med-danger/20 rounded-xl flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-med-danger animate-ping"></span>
                <div>
                  <span class="text-xs font-bold text-med-text block">AMB-042 Chest Pain</span>
                  <span class="text-xxs text-med-text-muted"
                    >ESI-2 • ETA 4 minutes • Prep Trauma Bay 1</span
                  >
                </div>
              </div>
              <Badge variant="esi2">ESI-2</Badge>
            </div>
            <div
              class="p-3.5 bg-med-card-sec/40 border border-med-border rounded-xl flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-med-warning"></span>
                <div>
                  <span class="text-xs font-bold text-med-text block"
                    >AMB-118 Orthopedic Laceration</span
                  >
                  <span class="text-xxs text-med-text-muted">ESI-3 • ETA 12 minutes</span>
                </div>
              </div>
              <Badge variant="esi3">ESI-3</Badge>
            </div>
          </div>
        </Card>

        <Card title="Discharge Clearance Board" subtitle="Patients cleared for discharge today">
          <template #title-icon><door-open class="w-4 h-4 text-med-teal" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              class="p-3.5 bg-med-success/5 border border-med-success/20 rounded-xl flex items-center justify-between"
            >
              <div>
                <span class="text-xs font-bold text-med-text block">Elena Rostova</span>
                <span class="text-xxs text-med-text-muted"
                  >Post-op cholecystectomy • Cleared by Dr. Lin</span
                >
              </div>
              <Badge variant="success">READY</Badge>
            </div>
            <div
              class="p-3.5 bg-med-warning/5 border border-med-warning/20 rounded-xl flex items-center justify-between"
            >
              <div>
                <span class="text-xs font-bold text-med-text block">James Peterson</span>
                <span class="text-xxs text-med-text-muted"
                  >COPD monitoring • Pending respiratory clearance</span
                >
              </div>
              <Badge variant="warning">PENDING</Badge>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           4. APPOINTMENTS
           ==================================================== -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHospitalStore } from '@/stores/hospitalStore'
import PageHeader from '@/components/common/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  UserPlus,
  DoorOpen,
  AlertTriangle,
  Clock
} from 'lucide-vue-next'

const hospitalStore = useHospitalStore()
const searchQuery = ref('')
const isRefreshing = ref(false)

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

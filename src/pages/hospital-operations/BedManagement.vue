<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Bed Management" description="Live Facility Bed Occupancy Map">
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="ICU Unit Beds" subtitle="Occupied: 4/6">
          <div class="text-2xl font-extrabold text-med-teal font-mono mt-2">66.6%</div>
        </Card>
        <Card title="Emergency Unit Beds" subtitle="Occupied: 7/10">
          <div class="text-2xl font-extrabold text-med-warning font-mono mt-2">70.0%</div>
        </Card>
        <Card title="Med-Surg Beds" subtitle="Occupied: 12/20">
          <div class="text-2xl font-extrabold text-med-primary font-mono mt-2">60.0%</div>
        </Card>
        <Card title="Average Turnaround" subtitle="Cleaning turnaround rate">
          <div class="text-2xl font-extrabold text-med-teal font-mono mt-2">38.4 min</div>
        </Card>
      </div>

      <Card title="Bed Layout Map" subtitle="Unit ward spatial telemetry grid (ICU & ED)">
        <template #title-icon><hotel class="w-4 h-4 text-med-teal" /></template>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-2">
          <div
            v-for="bed in hospitalStore.beds"
            :key="bed.id"
            :class="[
              'p-4 rounded-xl border flex flex-col gap-2 relative transition-all duration-300 text-left select-none',
              bed.status === 'Occupied'
                ? 'bg-med-primary/5 border-med-primary/20 hover:border-med-primary/45 hover:shadow-apple-subtle hover:shadow-apple-hover'
                : bed.status === 'Dirty'
                  ? 'bg-med-danger/5 border-med-danger/20 hover:border-med-danger/45 hover:shadow-alert-glow'
                  : bed.status === 'Reserved'
                    ? 'bg-med-warning/5 border-med-warning/20 hover:border-med-warning/45 hover:shadow-apple-subtle hover:shadow-apple-hover'
                    : 'bg-med-card-sec border-med-border hover:border-med-teal/45'
            ]"
          >
            <div class="flex items-center justify-between text-xxs font-bold">
              <span class="text-med-text">{{ bed.room }}</span>
              <span
                :class="[
                  'w-2 h-2 rounded-full',
                  bed.status === 'Occupied'
                    ? 'bg-med-primary'
                    : bed.status === 'Dirty'
                      ? 'bg-med-danger animate-pulse'
                      : bed.status === 'Reserved'
                        ? 'bg-med-warning'
                        : 'bg-med-teal'
                ]"
              ></span>
            </div>
            <div class="text-[9px] text-med-text-muted mt-2">
              <span v-if="bed.patientName" class="font-bold text-med-text block truncate">{{
                bed.patientName
              }}</span>
              <span v-else class="block">{{ bed.status }}</span>
              <span class="block mt-1 font-mono">T: {{ bed.turnaroundTimeMin }}m</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           12. EMERGENCY OPERATIONS (TRIAGE)
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
import { Activity, Search, Filter, RefreshCw, Hotel } from 'lucide-vue-next'

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

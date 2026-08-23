<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Surgery Management" description="Operating Room (OR) Scheduling & Status">
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
        <Card title="Active OR Suites" subtitle="Currently in use">
          <template #title-icon><scissors class="w-4 h-4 text-med-danger" /></template>
          <div class="text-3xl font-extrabold text-med-danger font-mono mt-2">
            {{ hospitalStore.operatingRooms.filter((o) => o.status === 'Intra-Op').length }}
          </div>
        </Card>
        <Card title="Scheduled Today" subtitle="Total procedures">
          <template #title-icon><calendar class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">
            {{ hospitalStore.operatingRooms.length }}
          </div>
        </Card>
        <Card title="Avg Duration" subtitle="Procedure time">
          <template #title-icon><clock class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">2.4h</div>
        </Card>
        <Card title="Utilization Rate" subtitle="OR throughput">
          <template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">78%</div>
        </Card>
      </div>

      <Card
        title="Operating Room Suite Status Board"
        subtitle="Live OR status, surgeon assignments, and timing"
      >
        <template #title-icon><scissors class="w-4 h-4 text-med-teal" /></template>
        <div class="flex flex-col gap-3.5 mt-2">
          <div
            v-for="or in hospitalStore.operatingRooms"
            :key="or.id"
            class="p-4 bg-med-card-sec/45 border border-med-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-med-primary/30 transition-all duration-300"
          >
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-med-text">{{ or.name }}</span>
                <Badge
                  :variant="
                    or.status === 'Intra-Op'
                      ? 'danger'
                      : or.status === 'Cleaning'
                        ? 'warning'
                        : 'success'
                  "
                  size="sm"
                  >{{ or.status }}</Badge
                >
              </div>
              <div class="text-[10px] text-med-text-muted">
                <span v-if="or.procedure !== 'None'"
                  >{{ or.procedure }} • Surgeon: {{ or.surgeon }}</span
                >
                <span v-else>Suite clean and ready for emergency staging</span>
              </div>
            </div>
            <div v-if="or.status === 'Intra-Op'" class="w-full md:w-48 flex flex-col gap-1">
              <div
                class="flex items-center justify-between font-mono text-[9px] text-med-text-muted"
              >
                <span>Progress</span>
                <span>{{ or.timeElapsedMin }}/{{ or.estimatedTimeMin }} min</span>
              </div>
              <div
                class="w-full bg-neutral-200 dark:bg-neutral-950/40 border border-med-border/40 rounded-full h-1.5 overflow-hidden"
              >
                <div
                  class="bg-med-danger h-full rounded-full transition-all duration-500"
                  :style="{ width: `${(or.timeElapsedMin / or.estimatedTimeMin) * 100}%` }"
                ></div>
              </div>
            </div>
            <div v-else-if="or.status === 'Cleaning'" class="w-full md:w-48 flex flex-col gap-1">
              <div
                class="flex items-center justify-between font-mono text-[9px] text-med-text-muted"
              >
                <span>Sanitization</span>
                <span>{{ or.timeElapsedMin }}/30 min</span>
              </div>
              <div
                class="w-full bg-neutral-200 dark:bg-neutral-950/40 border border-med-border/40 rounded-full h-1.5 overflow-hidden animate-pulse"
              >
                <div
                  class="bg-med-warning h-full rounded-full transition-all duration-500"
                  :style="{ width: `${(or.timeElapsedMin / 30) * 100}%` }"
                ></div>
              </div>
            </div>
            <div v-else>
              <Button size="sm" variant="outline" class="text-xxs">Stage Emergency</Button>
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           14. STAFF OPERATIONS
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
import { Activity, Search, Filter, RefreshCw, Scissors, Calendar, Clock } from 'lucide-vue-next'

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

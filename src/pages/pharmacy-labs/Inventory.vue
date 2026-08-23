<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Inventory" description="PPE Reserves & Medical Gas Supply Chain">
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
        <Card title="PPE Reserves" subtitle="Surgical masks & gloves">
          <template #title-icon><package-check class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">450</div>
          <div class="text-xxs text-med-text-muted mt-1">boxes available</div>
        </Card>
        <Card title="Medical O₂ Gas" subtitle="Cryogenic reserves">
          <template #title-icon><activity class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">84%</div>
          <div class="text-xxs text-med-text-muted mt-1">tank capacity</div>
        </Card>
        <Card title="Surgical Kits" subtitle="Sterile drape kits">
          <template #title-icon><scissors class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">120</div>
          <div class="text-xxs text-med-text-muted mt-1">kits in reserve</div>
        </Card>
        <Card title="Reorder Alerts" subtitle="Automated triggers">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">0</div>
          <div class="text-xxs text-med-success mt-1">All supply nominal</div>
        </Card>
      </div>

      <Card title="Supply Chain Monitor" subtitle="PPE, medical gas, and surgical supply reserves">
        <template #title-icon><package-check class="w-4 h-4 text-med-primary" /></template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div
            v-for="item in inventoryItems"
            :key="item.name"
            class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl"
          >
            <span class="text-xs font-bold text-med-text block mb-2">{{ item.name }}</span>
            <div class="flex items-center gap-2 mb-2">
              <div
                class="flex-1 bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-2 overflow-hidden"
              >
                <div
                  class="h-full rounded-full bg-med-teal transition-all"
                  :style="{ width: `${item.pct}%` }"
                ></div>
              </div>
              <span class="text-xxs font-mono font-bold text-med-text">{{ item.pct }}%</span>
            </div>
            <div class="text-xxs text-med-text-muted">{{ item.desc }}</div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           19. LAB OPERATIONS
           ==================================================== -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  PackageCheck,
  Scissors,
  AlertTriangle
} from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const inventoryItems = ref([
  { name: 'Surgical Mask N95', pct: 85, desc: 'High stock' },
  { name: 'Nitrile Gloves', pct: 60, desc: 'Moderate stock' },
  { name: 'Medical O2 Gas', pct: 84, desc: 'Tank capacity' }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

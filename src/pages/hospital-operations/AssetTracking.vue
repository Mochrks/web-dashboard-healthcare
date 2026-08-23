<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Asset Tracking" description="Ventilator & IV Pump RFID Locations">
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
        <Card title="Tracked Assets" subtitle="RFID tagged equipment">
          <template #title-icon><compass class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">156</div>
        </Card>
        <Card title="Online" subtitle="Active RFID signal">
          <template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">149</div>
        </Card>
        <Card title="Maintenance" subtitle="Under servicing">
          <template #title-icon><settings class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">5</div>
        </Card>
        <Card title="Battery Alerts" subtitle="Low charge warning">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
          <div class="text-3xl font-extrabold text-med-danger font-mono mt-2">2</div>
        </Card>
      </div>

      <Card
        title="Equipment RFID Location Grid"
        subtitle="Real-time medical device tracking system"
      >
        <template #title-icon><compass class="w-4 h-4 text-med-primary" /></template>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          <div
            v-for="asset in assetList"
            :key="asset.id"
            class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl hover:border-med-teal/30 transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-med-text">{{ asset.name }}</span>
              <Badge
                :variant="
                  asset.battery > 50 ? 'success' : asset.battery > 20 ? 'warning' : 'danger'
                "
                >{{ asset.battery }}%</Badge
              >
            </div>
            <div class="text-xxs text-med-text-muted space-y-1">
              <div class="flex justify-between">
                <span>RFID:</span><span class="font-mono text-med-text">{{ asset.id }}</span>
              </div>
              <div class="flex justify-between">
                <span>Location:</span
                ><span class="font-semibold text-med-teal">{{ asset.location }}</span>
              </div>
              <div class="flex justify-between">
                <span>Last Calibration:</span><span class="font-mono">{{ asset.calibrated }}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           17. PHARMACY
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
  Compass,
  Settings,
  AlertTriangle
} from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const assetList = ref([
  {
    id: 'VENT-102',
    name: 'Puritan Bennett 980',
    battery: 85,
    location: 'ICU Bed 4',
    calibrated: '2d ago'
  },
  {
    id: 'IVP-442',
    name: 'Alaris Pump Module',
    battery: 15,
    location: 'Med-Surg Room 204',
    calibrated: '5d ago'
  },
  {
    id: 'US-018',
    name: 'SonoSite Edge II',
    battery: 90,
    location: 'ED Trauma 1',
    calibrated: '1d ago'
  }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

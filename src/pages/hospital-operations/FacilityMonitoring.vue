<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Facility Monitoring" description="HVAC Venting & Clean Air Telemetry">
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
        <Card title="Air Quality Index" subtitle="HVAC clean air exchanges">
          <template #title-icon><thermometer-sun class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">22/hr</div>
        </Card>
        <Card title="Avg Temperature" subtitle="Facility-wide">
          <template #title-icon><thermometer-sun class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">68.4°F</div>
        </Card>
        <Card title="Humidity Level" subtitle="Clean room compliance">
          <template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">45%</div>
        </Card>
        <Card title="Energy Score" subtitle="Efficiency rating">
          <template #title-icon><activity class="w-4 h-4 text-med-purple" /></template>
          <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">94.2%</div>
        </Card>
      </div>

      <Card
        title="Facility Sensor Grid"
        subtitle="Real-time environmental telemetry from all zones"
      >
        <template #title-icon><thermometer-sun class="w-4 h-4 text-med-primary" /></template>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          <div
            v-for="sensor in facilitySensors"
            :key="sensor.zone"
            class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl hover:border-med-primary/30 transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-med-text">{{ sensor.zone }}</span>
              <Badge :variant="sensor.status === 'Nominal' ? 'success' : 'warning'">{{
                sensor.status
              }}</Badge>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center text-xxs">
              <div>
                <span class="text-med-text-muted block">Temp</span>
                <span class="font-bold font-mono text-med-text">{{ sensor.temp }}</span>
              </div>
              <div>
                <span class="text-med-text-muted block">Humidity</span>
                <span class="font-bold font-mono text-med-text">{{ sensor.humidity }}</span>
              </div>
              <div>
                <span class="text-med-text-muted block">Air Exch.</span>
                <span class="font-bold font-mono text-med-teal">{{ sensor.airExchange }}/hr</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           16. ASSET TRACKING
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
import { Activity, Search, Filter, RefreshCw, ThermometerSun } from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const facilitySensors = ref([
  { zone: 'OR Suite A', status: 'Nominal', temp: '68.2°F', humidity: '42%', airExchange: 25 },
  { zone: 'ICU Ward', status: 'Nominal', temp: '70.1°F', humidity: '45%', airExchange: 20 },
  { zone: 'NICU', status: 'Warning', temp: '72.4°F', humidity: '50%', airExchange: 18 }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

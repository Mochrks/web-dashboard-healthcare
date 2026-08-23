<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Pharmacy" description="Critical Formulary & Epinephrine reserves">
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
        <Card title="Formulary Items" subtitle="Active medications">
          <template #title-icon><pill class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">342</div>
        </Card>
        <Card title="Critical Low" subtitle="Below threshold">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
          <div class="text-3xl font-extrabold text-med-danger font-mono mt-2 animate-pulse">1</div>
        </Card>
        <Card title="Dispensed Today" subtitle="Total scripts filled">
          <template #title-icon><activity class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">47</div>
        </Card>
        <Card title="Pending Orders" subtitle="Awaiting fulfillment">
          <template #title-icon><clock class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">3</div>
        </Card>
      </div>

      <Card
        title="Drug Inventory & Stock Levels"
        subtitle="Critical formulary reserves and dispensing monitor"
      >
        <template #title-icon><pill class="w-4 h-4 text-med-primary" /></template>
        <div class="flex flex-col gap-3 mt-2">
          <div
            v-for="drug in pharmacyInventory"
            :key="drug.name"
            :class="[
              'p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all',
              drug.critical
                ? 'bg-med-danger/5 border-med-danger/20'
                : 'bg-med-card-sec/40 border-med-border'
            ]"
          >
            <div>
              <span class="text-xs font-bold text-med-text block">{{ drug.name }}</span>
              <span class="text-xxs text-med-text-muted">{{ drug.desc }}</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-32 flex flex-col gap-1">
                <div
                  class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1.5 overflow-hidden"
                >
                  <div
                    class="h-full rounded-full transition-all"
                    :class="drug.critical ? 'bg-med-danger animate-pulse' : 'bg-med-teal'"
                    :style="{ width: `${drug.pct}%` }"
                  ></div>
                </div>
                <span class="text-[9px] font-mono text-med-text-muted text-right">{{
                  drug.stock
                }}</span>
              </div>
              <Badge :variant="drug.critical ? 'esi1' : 'success'">{{
                drug.critical ? 'CRITICAL LOW' : 'IN STOCK'
              }}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           18. INVENTORY MANAGEMENT
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
import { Activity, Search, Filter, RefreshCw, Pill, AlertTriangle, Clock } from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const pharmacyInventory = ref([
  {
    name: 'Epinephrine Auto-Injectors',
    desc: '0.3mg adult dose',
    stock: '2',
    critical: true,
    pct: 15
  },
  {
    name: 'Propofol Injectable',
    desc: '10mg/mL 20mL vial',
    stock: '145',
    critical: false,
    pct: 75
  },
  { name: 'Fentanyl Citrate', desc: '50mcg/mL ampule', stock: '89', critical: false, pct: 60 }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

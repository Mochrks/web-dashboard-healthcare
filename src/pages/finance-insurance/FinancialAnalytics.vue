<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Financial Analytics" description="Department Budget Cost Margin Logs">
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
        <Card title="Monthly Revenue" subtitle="Gross income"
          ><template #title-icon><bar-chart class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">$2.4M</div></Card
        >
        <Card title="Operating Margin" subtitle="Net profit ratio"
          ><template #title-icon><activity class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">18.5%</div></Card
        >
        <Card title="Cost Per Case" subtitle="Avg expenditure"
          ><template #title-icon><landmark class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">$8.2K</div></Card
        >
        <Card title="Budget Usage" subtitle="Utilization rate"
          ><template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">76%</div></Card
        >
      </div>

      <Card title="Department Margin Analysis" subtitle="Operating margins by department">
        <template #title-icon><bar-chart class="w-4 h-4 text-med-primary" /></template>
        <div class="flex flex-col gap-3 mt-2">
          <div
            v-for="dept in deptMargins"
            :key="dept.name"
            class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-med-text">{{ dept.name }}</span>
              <span
                class="text-xs font-bold font-mono"
                :class="dept.margin >= 0 ? 'text-med-success' : 'text-med-danger'"
                >{{ dept.margin >= 0 ? '+' : '' }}{{ dept.margin }}%</span
              >
            </div>
            <div
              class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-2 overflow-hidden"
            >
              <div
                class="h-full rounded-full transition-all"
                :class="dept.margin >= 0 ? 'bg-med-teal' : 'bg-med-danger'"
                :style="{ width: `${Math.abs(dept.margin) * 2}%` }"
              ></div>
            </div>
            <span class="text-xxs text-med-text-muted mt-1 block">{{ dept.desc }}</span>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           23. SECURITY CENTER (HIPAA)
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
import { Activity, Search, Filter, RefreshCw, BarChart, Landmark } from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const deptMargins = ref([
  { name: 'Cardiology', margin: 12.4, desc: 'High volume procedures' },
  { name: 'Emergency', margin: -4.2, desc: 'Uncompensated care impact' },
  { name: 'Surgery', margin: 28.6, desc: 'Elective recovery' }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

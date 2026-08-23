<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Reports" description="Advanced CSV/FHIR Report Builder">
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Reports Generated" subtitle="This month"
          ><template #title-icon><file-spreadsheet class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">34</div></Card
        >
        <Card title="Scheduled Reports" subtitle="Auto-generated"
          ><template #title-icon><clock class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">8</div></Card
        >
        <Card title="Export Formats" subtitle="Supported outputs"
          ><template #title-icon><file-spreadsheet class="w-4 h-4 text-med-purple" /></template>
          <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">
            CSV / PDF / FHIR
          </div></Card
        >
      </div>

      <Card
        title="Report Builder Console"
        subtitle="Generate custom analytics reports and data exports"
      >
        <template #title-icon><file-spreadsheet class="w-4 h-4 text-med-primary" /></template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div
            v-for="report in reportTypes"
            :key="report.name"
            class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl hover:border-med-primary/30 transition-all duration-300 cursor-pointer group"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-8 h-8 rounded-lg bg-med-primary/10 border border-med-primary/20 flex items-center justify-center"
              >
                <file-spreadsheet class="w-4 h-4 text-med-primary" />
              </div>
              <div>
                <span
                  class="text-xs font-bold text-med-text group-hover:text-med-primary transition-colors"
                  >{{ report.name }}</span
                >
                <span class="text-xxs text-med-text-muted block">{{ report.desc }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between text-xxs text-med-text-muted mt-2">
              <span>Last generated: {{ report.last }}</span>
              <Button size="sm" variant="outline" class="h-6 text-xxs py-0.5">Generate</Button>
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           28. API & INTEGRATIONS
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
import { Activity, Search, Filter, RefreshCw, FileSpreadsheet, Clock } from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const reportTypes = ref([
  {
    name: 'Daily Census & Acuity',
    desc: 'Midnight census, admission/discharge stats',
    last: 'Today, 00:05 AM'
  },
  {
    name: 'Sepsis Compliance (CMS)',
    desc: 'SEP-1 core measure adherence reporting',
    last: 'Yesterday, 23:55 PM'
  },
  {
    name: 'Revenue Cycle Snapshot',
    desc: 'Daily billings, denials, and A/R days',
    last: 'Today, 06:00 AM'
  }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

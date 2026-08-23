<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="API Integrations" description="HL7 / FHIR API Webhook integrations">
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
        <Card title="Active Endpoints" subtitle="API listeners"
          ><template #title-icon><webhook class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">6</div></Card
        >
        <Card title="Webhooks" subtitle="Event subscribers"
          ><template #title-icon><webhook class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">4</div></Card
        >
        <Card title="Uptime" subtitle="API availability"
          ><template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">99.97%</div></Card
        >
        <Card title="Avg Latency" subtitle="Response time"
          ><template #title-icon><clock class="w-4 h-4 text-med-purple" /></template>
          <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">72ms</div></Card
        >
      </div>

      <Card
        title="HL7 / FHIR API Gateway Status"
        subtitle="Active webhook listeners and integration endpoints"
      >
        <template #title-icon><webhook class="w-4 h-4 text-med-primary" /></template>
        <div class="flex flex-col gap-3 mt-2">
          <div
            v-for="api in apiEndpoints"
            :key="api.name"
            class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-med-primary/30 transition-all"
          >
            <div class="flex items-center gap-3">
              <span
                class="w-2.5 h-2.5 rounded-full"
                :class="
                  api.status === 'Connected' ? 'bg-med-success' : 'bg-med-warning animate-pulse'
                "
              ></span>
              <div>
                <span class="text-xs font-bold text-med-text block">{{ api.name }}</span>
                <span class="text-xxs text-med-text-muted">{{ api.desc }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xxs font-mono text-med-text-muted">{{ api.endpoint }}</span>
              <Badge :variant="api.status === 'Connected' ? 'success' : 'warning'">{{
                api.status.toUpperCase()
              }}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           29. SETTINGS
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
import { Activity, Search, Filter, RefreshCw, Webhook, Clock } from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const apiEndpoints = ref([
  {
    name: 'Epic EHR FHIR',
    desc: 'Bi-directional patient sync',
    endpoint: '/api/v1/fhir/epic',
    status: 'Connected'
  },
  {
    name: 'Cerner Lab Gateway',
    desc: 'Lab results ingestion webhook',
    endpoint: '/api/v2/labs/cerner',
    status: 'Warning'
  }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

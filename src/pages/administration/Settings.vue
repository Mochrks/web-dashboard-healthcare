<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Settings" description="Aether OS System Configuration">
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Clinic Profile" subtitle="Organization settings">
          <template #title-icon><settings class="w-4 h-4 text-med-primary" /></template>
          <div class="flex flex-col gap-4 mt-2 text-xs">
            <div class="flex justify-between py-2 border-b border-med-border/40">
              <span class="text-med-text-muted">Organization</span
              ><span class="font-semibold text-med-text">Aether Medical Center</span>
            </div>
            <div class="flex justify-between py-2 border-b border-med-border/40">
              <span class="text-med-text-muted">License Type</span
              ><span class="font-semibold text-med-text">Enterprise (Unlimited)</span>
            </div>
            <div class="flex justify-between py-2 border-b border-med-border/40">
              <span class="text-med-text-muted">EHR System</span
              ><span class="font-semibold text-med-primary">Aether Clinical OS v3.5</span>
            </div>
            <div class="flex justify-between py-2 border-b border-med-border/40">
              <span class="text-med-text-muted">FHIR Version</span
              ><span class="font-semibold font-mono text-med-text">R4 (4.0.1)</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-med-text-muted">Timezone</span
              ><span class="font-semibold text-med-text">UTC-5 (Eastern)</span>
            </div>
          </div>
        </Card>

        <Card title="System Configuration" subtitle="Alert volumes and preferences">
          <template #title-icon><settings class="w-4 h-4 text-med-purple" /></template>
          <div class="flex flex-col gap-4 mt-2 text-xs">
            <div class="flex items-center justify-between py-2 border-b border-med-border/40">
              <span class="text-med-text-muted">Critical Alert Volume</span>
              <div class="flex items-center gap-2">
                <div
                  class="w-24 bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-2 overflow-hidden"
                >
                  <div class="bg-med-danger h-full rounded-full" style="width: 85%"></div>
                </div>
                <span class="font-mono text-med-text font-bold">85%</span>
              </div>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-med-border/40">
              <span class="text-med-text-muted">Auto-Refresh Interval</span>
              <span class="font-semibold font-mono text-med-text">10 seconds</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-med-border/40">
              <span class="text-med-text-muted">Data Encryption</span>
              <Badge variant="success">AES-256 ACTIVE</Badge>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-med-border/40">
              <span class="text-med-text-muted">Two-Factor Auth</span>
              <Badge variant="success">ENABLED</Badge>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-med-text-muted">Session Timeout</span>
              <span class="font-semibold font-mono text-med-text">30 minutes</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import { Activity, Search, Filter, RefreshCw, Settings } from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

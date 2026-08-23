<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Security Center" description="HIPAA Gateway Access Logs & Audits">
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
        <Card title="Encryption Level" subtitle="Access tunnels status"
          ><template #title-icon><lock class="w-4 h-4 text-med-primary" /></template>
          <div class="text-2xl font-extrabold text-med-primary font-mono mt-2">
            AES-256 GCM
          </div></Card
        >
        <Card title="HIPAA Incidents" subtitle="Suspicious triggers"
          ><template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
          <div class="text-2xl font-extrabold text-med-danger font-mono mt-2">1 Flagged</div></Card
        >
        <Card title="User Sessions" subtitle="Active terminals"
          ><template #title-icon><users class="w-4 h-4 text-med-teal" /></template>
          <div class="text-2xl font-extrabold text-med-teal font-mono mt-2">42 active</div></Card
        >
      </div>

      <Card title="HIPAA Access Audit Ledger" subtitle="EHR read/write event records catalog">
        <template #title-icon><lock class="w-4 h-4 text-med-primary" /></template>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr class="border-b border-med-border text-med-text-muted font-bold">
                <th class="py-3 px-4">User</th>
                <th class="py-3 px-4">Role</th>
                <th class="py-3 px-4">Action</th>
                <th class="py-3 px-4">Resource</th>
                <th class="py-3 px-4">IP Address</th>
                <th class="py-3 px-4">Timestamp</th>
                <th class="py-3 px-4">HIPAA Audit</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-med-border/50">
              <tr
                v-for="log in hospitalStore.securityLogs"
                :key="log.id"
                class="hover:bg-med-card-sec/45 transition-colors"
              >
                <td class="py-3.5 px-4 font-semibold text-med-text">{{ log.user }}</td>
                <td class="py-3.5 px-4 text-med-text-muted">{{ log.role }}</td>
                <td class="py-3.5 px-4 text-med-text-muted">{{ log.action }}</td>
                <td class="py-3.5 px-4 text-med-text-muted font-mono">{{ log.resource }}</td>
                <td class="py-3.5 px-4 text-med-text-muted font-mono">{{ log.ipAddress }}</td>
                <td class="py-3.5 px-4 text-med-text-muted font-mono">{{ log.timestamp }}</td>
                <td class="py-3.5 px-4">
                  <Badge :variant="log.hipaaFlag ? 'esi1' : 'success'">{{
                    log.hipaaFlag ? 'FLAGGED' : 'OK'
                  }}</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- ====================================================
           24. COMPLIANCE & AUDIT
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
import { Activity, Search, Filter, RefreshCw, Lock, AlertTriangle, Users } from 'lucide-vue-next'

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

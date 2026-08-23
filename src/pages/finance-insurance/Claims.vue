<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Insurance Claims" description="Claims Prior-Authorization & Denial Audits">
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
        <Card title="Submitted" subtitle="Total claims filed"
          ><template #title-icon><receipt class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">24</div></Card
        >
        <Card title="Approved" subtitle="Insurance cleared"
          ><template #title-icon><check-circle class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">19</div></Card
        >
        <Card title="Denied" subtitle="Requires appeal"
          ><template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
          <div class="text-3xl font-extrabold text-med-danger font-mono mt-2">3</div></Card
        >
        <Card title="Appealed" subtitle="Under review"
          ><template #title-icon><clock class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">2</div></Card
        >
      </div>

      <Card
        title="Claims Audit Trail"
        subtitle="Prior-authorization, denial audits, and appeal status"
      >
        <template #title-icon><receipt class="w-4 h-4 text-med-primary" /></template>
        <div class="flex flex-col gap-3 mt-2">
          <div
            v-for="claim in claimsList"
            :key="claim.id"
            :class="[
              'p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3',
              claim.status === 'DENIED'
                ? 'bg-med-danger/5 border-med-danger/20'
                : claim.status === 'APPEALED'
                  ? 'bg-med-warning/5 border-med-warning/20'
                  : 'bg-med-card-sec/40 border-med-border'
            ]"
          >
            <div>
              <span class="text-xs font-bold text-med-text block"
                >{{ claim.id }}: {{ claim.patient }}</span
              >
              <span class="text-xxs text-med-text-muted">{{ claim.desc }}</span>
            </div>
            <Badge
              :variant="
                claim.status === 'APPROVED'
                  ? 'success'
                  : claim.status === 'DENIED'
                    ? 'esi1'
                    : 'esi2'
              "
              >{{ claim.status }}</Badge
            >
          </div>
        </div>
      </Card>

      <!-- ====================================================
           22. FINANCIAL ANALYTICS
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
  Receipt,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const claimsList = ref([
  { id: 'CLM-001', patient: 'Michael Chang', desc: 'Cardiac echo prior-auth', status: 'APPROVED' },
  { id: 'CLM-002', patient: 'Sarah Jenkins', desc: 'Pulmonary function test', status: 'DENIED' },
  { id: 'CLM-003', patient: 'Robert Chen', desc: 'Neurology consult', status: 'APPEALED' }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

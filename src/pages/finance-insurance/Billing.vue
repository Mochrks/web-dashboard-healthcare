<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Billing & Payments" description="Revenue Cycle Management & Payments">
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
        <Card title="Revenue Today" subtitle="Total collected">
          <template #title-icon><landmark class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">$84.2K</div>
        </Card>
        <Card title="Outstanding" subtitle="Pending payments">
          <template #title-icon><receipt class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">$63.0K</div>
        </Card>
        <Card title="Collected Rate" subtitle="Payment success">
          <template #title-icon><activity class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">92.4%</div>
        </Card>
        <Card title="Avg Claim Value" subtitle="Per patient invoice">
          <template #title-icon><bar-chart class="w-4 h-4 text-med-purple" /></template>
          <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">$14.8K</div>
        </Card>
      </div>

      <Card
        title="Patient Invoice Ledger"
        subtitle="Revenue cycle billing and reconciliation records"
      >
        <template #title-icon><landmark class="w-4 h-4 text-med-primary" /></template>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr class="border-b border-med-border text-med-text-muted font-bold">
                <th class="py-3 px-4">Patient</th>
                <th class="py-3 px-4">Service</th>
                <th class="py-3 px-4">Amount</th>
                <th class="py-3 px-4">Insurance</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-med-border/50">
              <tr
                v-for="inv in invoices"
                :key="inv.patient"
                class="hover:bg-med-card-sec/45 transition-colors"
              >
                <td class="py-3.5 px-4 font-semibold text-med-text">{{ inv.patient }}</td>
                <td class="py-3.5 px-4 text-med-text-muted">{{ inv.service }}</td>
                <td class="py-3.5 px-4 font-mono font-bold text-med-text">{{ inv.amount }}</td>
                <td class="py-3.5 px-4 text-med-text-muted">{{ inv.insurance }}</td>
                <td class="py-3.5 px-4">
                  <Badge
                    :variant="
                      inv.status === 'CLEARED'
                        ? 'success'
                        : inv.status === 'PENDING'
                          ? 'warning'
                          : 'outline'
                    "
                    >{{ inv.status }}</Badge
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- ====================================================
           21. INSURANCE CLAIMS
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
import { Activity, Search, Filter, RefreshCw, Landmark, Receipt, BarChart } from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const invoices = ref([
  {
    patient: 'Michael Chang',
    service: 'Echocardiogram',
    amount: '$1,200',
    insurance: 'BlueCross',
    status: 'CLEARED'
  },
  {
    patient: 'Sarah Jenkins',
    service: 'ER Visit Level 4',
    amount: '$3,450',
    insurance: 'Medicare',
    status: 'PENDING'
  },
  {
    patient: 'Robert Chen',
    service: 'Neurology Consult',
    amount: '$450',
    insurance: 'Aetna',
    status: 'DENIED'
  }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

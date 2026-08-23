<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader
      title="Laboratory Operations"
      description="Pathology centrifuges & Specimen pipeline"
    >
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
        <Card title="Specimens Pending" subtitle="In pathology queue">
          <template #title-icon><clipboard-check class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">6</div>
        </Card>
        <Card title="Centrifuges Active" subtitle="Lab equipment status">
          <template #title-icon><activity class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">2/3</div>
        </Card>
        <Card title="Turnaround Time" subtitle="Avg specimen to result">
          <template #title-icon><clock class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">48m</div>
        </Card>
        <Card title="Centrifuge Temp" subtitle="Lab-C2 cooling">
          <template #title-icon><thermometer-sun class="w-4 h-4 text-med-danger" /></template>
          <div class="text-3xl font-extrabold text-med-danger font-mono mt-2 animate-pulse">
            4.2°C
          </div>
          <div class="text-xxs text-med-danger mt-1">Above 4°C max threshold!</div>
        </Card>
      </div>

      <Card
        title="Specimen Processing Pipeline"
        subtitle="Pathology centrifuge calibration and queue"
      >
        <template #title-icon><clipboard-check class="w-4 h-4 text-med-primary" /></template>
        <div class="flex flex-col gap-3 mt-2">
          <div
            class="p-3.5 bg-med-danger/5 border border-med-danger/20 rounded-xl flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-med-danger animate-pulse"></span>
              <div>
                <span class="text-xs font-bold text-med-text block">Centrifuge Lab-C2</span>
                <span class="text-xxs text-med-text-muted"
                  >Cooling unit malfunction! Temp 4.2°C exceeds 4°C max</span
                >
              </div>
            </div>
            <Badge variant="esi2">ALERT</Badge>
          </div>
          <div
            class="p-3.5 bg-med-success/5 border border-med-success/20 rounded-xl flex items-center justify-between"
          >
            <div>
              <span class="text-xs font-bold text-med-text block">Centrifuge Lab-C3</span>
              <span class="text-xxs text-med-text-muted"
                >Fully calibrated. Pathology streams active</span
              >
            </div>
            <Badge variant="success">NOMINAL</Badge>
          </div>
          <div
            class="p-3.5 bg-med-card-sec/40 border border-med-border rounded-xl flex items-center justify-between"
          >
            <div>
              <span class="text-xs font-bold text-med-text block">Specimen Queue</span>
              <span class="text-xxs text-med-text-muted"
                >6 blood panels pending biochemistry processing</span
              >
            </div>
            <Badge variant="outline">6 PENDING</Badge>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           20. BILLING & PAYMENTS
           ==================================================== -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHospitalStore } from '@/stores/hospitalStore'
import PageHeader from '@/components/common/PageHeader.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Users,
  AlertTriangle,
  Hotel,
  FileText,
  ClipboardCheck,
  UserPlus,
  FileSearch,
  ArrowRightLeft,
  UserCheck,
  ShieldAlert,
  HeartPulse,
  FileHeart,
  BriefcaseMedical,
  Scissors,
  ActivitySquare,
  Pill,
  Receipt,
  Landmark,
  BarChart3,
  MessageSquareDashed,
  Bell,
  Shield,
  Key,
  FileSpreadsheet,
  Webhook,
  Settings
} from 'lucide-vue-next'

const hospitalStore = useHospitalStore()
const searchQuery = ref('')
const isRefreshing = ref(false)

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}

const handleEhr = (pat: any) => {
  console.log('Viewing EHR for', pat.name)
}
</script>

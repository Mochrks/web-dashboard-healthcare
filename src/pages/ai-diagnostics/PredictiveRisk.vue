<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Predictive Risk Engine" description="Sepsis & Decompensation Risk Engine">
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
        <Card title="High Risk Patients" subtitle="Decompensation alerts">
          <template #title-icon><shield-alert class="w-4 h-4 text-med-danger" /></template>
          <div class="text-3xl font-extrabold text-med-danger font-mono mt-2 animate-pulse">2</div>
        </Card>
        <Card title="Avg qSOFA Score" subtitle="Across ICU census">
          <template #title-icon><activity class="w-4 h-4 text-med-purple" /></template>
          <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">5.4</div>
        </Card>
        <Card title="30-Day Readmission" subtitle="Population avg risk">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">14.2%</div>
        </Card>
      </div>

      <Card
        title="Patient Risk Stratification Matrix"
        subtitle="AI predictive models for sepsis onset, cardiac arrest, and readmission"
      >
        <template #title-icon><shield-alert class="w-4 h-4 text-med-purple" /></template>
        <div class="flex flex-col gap-4 mt-2">
          <div
            v-for="pat in hospitalStore.patients"
            :key="pat.id"
            class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-med-text"
                >{{ pat.name }} • Bed {{ pat.bed }}</span
              >
              <Badge
                :variant="pat.riskScore >= 70 ? 'esi1' : pat.riskScore >= 40 ? 'esi2' : 'success'"
              >
                {{
                  pat.riskScore >= 70 ? 'HIGH RISK' : pat.riskScore >= 40 ? 'MODERATE' : 'LOW RISK'
                }}
              </Badge>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-xxs">
              <div>
                <span class="text-med-text-muted block">Sepsis (qSOFA)</span>
                <span
                  class="font-bold font-mono"
                  :class="pat.riskScore >= 70 ? 'text-med-danger animate-pulse' : 'text-med-text'"
                  >{{ pat.riskScore }}%</span
                >
                <div
                  class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1 mt-1 overflow-hidden"
                >
                  <div
                    class="h-full rounded-full transition-all"
                    :class="pat.riskScore >= 70 ? 'bg-med-danger' : 'bg-med-teal'"
                    :style="{ width: `${pat.riskScore}%` }"
                  ></div>
                </div>
              </div>
              <div>
                <span class="text-med-text-muted block">Readmission 30d</span>
                <span class="font-bold font-mono text-med-warning">{{ pat.readmissionRisk }}%</span>
                <div
                  class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1 mt-1 overflow-hidden"
                >
                  <div
                    class="bg-med-warning h-full rounded-full transition-all"
                    :style="{ width: `${pat.readmissionRisk}%` }"
                  ></div>
                </div>
              </div>
              <div>
                <span class="text-med-text-muted block">Cardiac Arrest</span>
                <span class="font-bold font-mono text-med-purple"
                  >{{ Math.round(pat.riskScore * 0.18) }}%</span
                >
                <div
                  class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1 mt-1 overflow-hidden"
                >
                  <div
                    class="bg-med-purple h-full rounded-full transition-all"
                    :style="{ width: `${pat.riskScore * 0.18}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           10. CLINICAL DECISION SUPPORT
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

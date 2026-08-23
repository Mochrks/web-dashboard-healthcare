<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="AI Diagnosis" description="Differential Diagnosis Assistant">
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
        <Card title="Active Diagnoses" subtitle="Running model inferences">
          <template #title-icon><stethoscope class="w-4 h-4 text-med-purple" /></template>
          <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">3</div>
        </Card>
        <Card title="Avg Model Confidence" subtitle="Across all active cases">
          <template #title-icon><brain-circuit class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">91.4%</div>
        </Card>
        <Card title="Cases Resolved Today" subtitle="AI-assisted closures">
          <template #title-icon><check-circle class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">7</div>
        </Card>
      </div>

      <Card
        title="Differential Diagnosis Console"
        subtitle="AI-generated diagnostic assessments with confidence scores"
      >
        <template #title-icon><brain-circuit class="w-4 h-4 text-med-purple" /></template>
        <div class="flex flex-col gap-4 mt-2">
          <div
            v-for="dx in differentialDiagnoses"
            :key="dx.patient"
            class="p-4 bg-med-card-sec/40 border border-med-border hover:border-med-purple/30 rounded-xl transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-med-text flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full"
                  :class="dx.conf >= 90 ? 'bg-med-danger animate-pulse' : 'bg-med-warning'"
                ></span>
                {{ dx.patient }}
              </span>
              <Badge :variant="dx.conf >= 90 ? 'esi1' : 'esi3'">{{ dx.conf }}% Confidence</Badge>
            </div>
            <p class="text-xxs text-med-text-muted leading-relaxed mb-3">{{ dx.assessment }}</p>
            <div
              class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1.5 border border-med-border/40 overflow-hidden"
            >
              <div
                class="bg-med-purple h-full rounded-full transition-all duration-500"
                :style="{ width: `${dx.conf}%` }"
              ></div>
            </div>
            <div class="flex items-center justify-between mt-3 text-xxs text-med-text-muted">
              <span>ICD-10: {{ dx.icd }}</span>
              <span class="text-med-purple font-semibold">{{ dx.recommendation }}</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           7. MEDICAL IMAGING AI (DICOM)
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

<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Compliance" description="Regulatory Accreditations & Policy Renewal">
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
        <Card title="Audit Score" subtitle="Overall compliance"
          ><template #title-icon><landmark class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">98.4%</div></Card
        >
        <Card title="Active Certs" subtitle="Valid certifications"
          ><template #title-icon><check-circle class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">14</div></Card
        >
        <Card title="Policies Due" subtitle="Renewal within 90d"
          ><template #title-icon><clock class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">2</div></Card
        >
        <Card title="Last Audit" subtitle="Joint Commission"
          ><template #title-icon><clipboard-check class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">Gold</div></Card
        >
      </div>

      <Card
        title="Regulatory Compliance Checklist"
        subtitle="Accreditation audit trail and policy renewals"
      >
        <template #title-icon><landmark class="w-4 h-4 text-med-primary" /></template>
        <div class="flex flex-col gap-3 mt-2">
          <div
            v-for="item in complianceItems"
            :key="item.name"
            class="p-3.5 bg-med-card-sec/40 border border-med-border rounded-xl flex items-center justify-between hover:border-med-primary/30 transition-all"
          >
            <div class="flex items-center gap-3">
              <check-circle v-if="item.passed" class="w-4 h-4 text-med-success" />
              <clock v-else class="w-4 h-4 text-med-warning" />
              <div>
                <span class="text-xs font-bold text-med-text block">{{ item.name }}</span>
                <span class="text-xxs text-med-text-muted">{{ item.desc }}</span>
              </div>
            </div>
            <Badge :variant="item.passed ? 'success' : 'warning'">{{
              item.passed ? 'VALID' : 'DUE'
            }}</Badge>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           25. MESSAGES & COLLABORATION
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

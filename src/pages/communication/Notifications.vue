<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Notifications" description="Operations Notification Alerts Panel">
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
        <Card title="Total Alerts" subtitle="All time today"
          ><template #title-icon><bell class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">42</div></Card
        >
        <Card title="Critical" subtitle="Require action"
          ><template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
          <div class="text-3xl font-extrabold text-med-danger font-mono mt-2">
            {{ hospitalStore.stats.activeCriticalAlerts }}
          </div></Card
        >
        <Card title="Warnings" subtitle="Advisory notices"
          ><template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">8</div></Card
        >
        <Card title="Informational" subtitle="Log events"
          ><template #title-icon><info class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">31</div></Card
        >
      </div>

      <Card
        title="Operations Alert Feed"
        subtitle="Filtered alert stream from all clinical systems"
      >
        <template #title-icon><bell class="w-4 h-4 text-med-primary" /></template>
        <div class="flex flex-col gap-3 mt-2">
          <div
            v-for="alt in hospitalStore.alerts"
            :key="alt.id"
            :class="[
              'p-4 rounded-xl border flex items-start gap-3 transition-all',
              alt.level === 'critical'
                ? 'bg-med-danger/5 border-med-danger/20'
                : 'bg-med-warning/5 border-med-warning/20'
            ]"
          >
            <span
              class="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
              :class="alt.level === 'critical' ? 'bg-med-danger animate-ping' : 'bg-med-warning'"
            ></span>
            <div class="flex-1">
              <div class="flex items-center justify-between gap-4">
                <span class="text-xs font-bold text-med-text">{{ alt.title }}</span>
                <span class="text-[9px] text-med-text-muted font-mono">{{ alt.timestamp }}</span>
              </div>
              <p class="text-xxs text-med-text-muted mt-1 leading-relaxed">{{ alt.message }}</p>
            </div>
            <Badge :variant="alt.level === 'critical' ? 'esi1' : 'warning'">{{
              alt.level.toUpperCase()
            }}</Badge>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           27. REPORTS & ANALYTICS
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

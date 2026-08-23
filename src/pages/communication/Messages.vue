<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Messages" description="Physician secure messaging board">
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
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Conversations" subtitle="Active secure threads" class="lg:col-span-1">
          <template #title-icon
            ><message-square-dashed class="w-4 h-4 text-med-primary"
          /></template>
          <div class="flex flex-col gap-2 mt-2">
            <div
              v-for="msg in messageThreads"
              :key="msg.from"
              class="p-3 bg-med-card-sec/40 border border-med-border hover:border-med-primary/30 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-300"
            >
              <div
                class="w-8 h-8 rounded-full bg-med-primary/10 border border-med-primary/20 flex items-center justify-center text-xxs font-bold text-med-primary"
              >
                {{
                  msg.from
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .slice(0, 2)
                }}
              </div>
              <div class="flex-1 min-w-0">
                <span class="text-xs font-bold text-med-text block truncate">{{ msg.from }}</span>
                <span class="text-xxs text-med-text-muted truncate block">{{ msg.preview }}</span>
              </div>
              <span class="text-[9px] text-med-text-muted font-mono whitespace-nowrap">{{
                msg.time
              }}</span>
            </div>
          </div>
        </Card>

        <Card title="Active Thread" subtitle="Encrypted clinical discussion" class="lg:col-span-2">
          <template #title-icon
            ><message-square-dashed class="w-4 h-4 text-med-primary"
          /></template>
          <div
            class="flex flex-col gap-3 mt-2 min-h-[300px] border border-med-border rounded-xl bg-slate-50 dark:bg-neutral-950/20 p-4"
          >
            <div
              v-for="msg in messageThreads"
              :key="msg.from + msg.time"
              :class="[
                'p-3 rounded-xl border max-w-[80%] text-xs',
                msg.self
                  ? 'bg-med-primary/10 border-med-primary/20 ml-auto'
                  : 'bg-med-card border-med-border mr-auto'
              ]"
            >
              <span
                class="text-[10px] font-bold block mb-1"
                :class="msg.self ? 'text-med-primary' : 'text-med-purple'"
                >{{ msg.from }}</span
              >
              <span class="text-med-text">{{ msg.preview }}</span>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           26. NOTIFICATIONS CENTER
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

<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Telemedicine" description="Virtual Telehealth Consultation Portal">
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
      <Card
        title="Live Consultation Stream"
        subtitle="Dr. Evelyn Carter connecting..."
        class="lg:col-span-2"
        :hover-glow="true"
      >
        <template #title-icon><video-icon class="w-4 h-4 text-med-danger" /></template>
        <template #header-action>
          <Badge variant="danger" :dot="true" :pulse="true">ON AIR</Badge>
        </template>
        <div
          class="relative aspect-video bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden flex items-center justify-center"
        >
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center flex flex-col items-center gap-3">
              <div
                class="w-16 h-16 rounded-full bg-med-purple/10 border border-med-purple/35 flex items-center justify-center animate-pulse"
              >
                <users class="w-8 h-8 text-med-purple" />
              </div>
              <div class="text-xs text-white">Secure Remote Call: Sarah Jenkins</div>
              <div class="text-[10px] text-neutral-400 font-mono">
                1080p • 2.4 Mbps • AES-256 Encrypted
              </div>
            </div>
          </div>
          <div
            class="absolute bottom-4 right-4 w-32 aspect-video bg-med-card border border-med-border rounded-lg overflow-hidden flex items-center justify-center text-[10px] text-med-text font-semibold"
          >
            <span>Dr. Carter (You)</span>
          </div>
        </div>
        <div class="flex items-center justify-center gap-3 mt-4">
          <Button variant="danger" size="sm">End Session</Button>
          <Button variant="outline" size="sm">Mute Audio</Button>
          <Button variant="outline" size="sm">Share EHR Canvas</Button>
        </div>
      </Card>

      <Card title="Remote Vital Telemetry" subtitle="Realtime health sync" :hover-glow-ai="true">
        <template #title-icon><activity class="w-4 h-4 text-med-primary" /></template>
        <div class="flex flex-col gap-4 mt-2">
          <ECGMonitor :heart-rate="88" label="REMOTE ECG" color="#14B8A6" vitals-type="ecg" />
          <div
            class="bg-med-card-sec border border-med-border p-3.5 rounded-xl text-left select-none"
          >
            <span class="text-xxs font-bold text-med-purple uppercase tracking-wider block mb-1"
              >AI Remote Diagnostic Advisory</span
            >
            <p class="text-xxs text-med-text-muted leading-relaxed">
              Oxygen saturation is borderline (92%). Model recommends ordering remote spirometry
              test and prescribing albuterol inhaler immediately.
            </p>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           6. AI DIAGNOSIS ASSISTANT
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

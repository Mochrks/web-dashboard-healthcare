<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Medical Imaging" description="Radiology MRI / CT Scan Diagnostic AI">
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
        title="AI DICOM Radiology Canvas"
        subtitle="Chest X-Ray / Brain MRI segmentation model"
        class="lg:col-span-2"
        :hover-glow-ai="true"
      >
        <template #title-icon><file-heart class="w-4 h-4 text-med-purple" /></template>
        <div
          class="relative aspect-square md:aspect-video bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden flex items-center justify-center p-4"
        >
          <div
            class="relative w-72 h-72 border border-med-border/30 rounded-full bg-neutral-900/60 overflow-hidden flex items-center justify-center"
          >
            <div
              class="absolute inset-0 bg-[radial-gradient(#253046_1px,transparent_1px)] [background-size:16px_16px] opacity-20"
            ></div>
            <div
              class="absolute w-full h-[2px] bg-med-purple shadow-apple-subtle hover:shadow-apple-hover animate-bounce top-0"
            ></div>
            <div
              class="w-56 h-56 rounded-full border-4 border-dashed border-med-text-muted/20 flex items-center justify-center"
            >
              <div
                class="w-44 h-44 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center"
              >
                <div
                  class="w-10 h-10 bg-med-purple/15 border-2 border-dashed border-med-purple rounded-full animate-ping flex items-center justify-center"
                >
                  <span class="text-[7px] text-med-purple font-bold">LESION AI</span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="absolute top-4 left-4 bg-black/60 px-3 py-1.5 border border-med-border rounded-lg text-xxs font-mono text-neutral-400"
          >
            <span>SCAN #DICOM-BRAIN-904</span>
          </div>
        </div>
        <div class="flex items-center justify-center gap-3 mt-4">
          <Button size="sm" @click="runAILesionScan" :loading="isScanningImaging"
            >Run AI Lesion Analysis</Button
          >
          <Button size="sm" variant="outline">Segment Tissues</Button>
        </div>
      </Card>

      <Card
        title="MRI Segmentation Logs"
        subtitle="Neural classification margins"
        :hover-glow-ai="true"
      >
        <template #title-icon><brain-circuit class="w-4 h-4 text-med-purple" /></template>
        <div class="flex flex-col gap-4 mt-2 select-none text-left">
          <div
            v-for="item in mriLogs"
            :key="item.label"
            class="p-3 bg-med-card-sec border border-med-border rounded-xl flex items-center justify-between text-xxs"
          >
            <div>
              <span class="font-bold text-med-text block">{{ item.label }}</span>
              <span class="text-med-text-muted font-normal mt-0.5 block"
                >Confidence margin: {{ item.conf }}</span
              >
            </div>
            <Badge :variant="item.risk === 'High' ? 'esi1' : 'outline'">{{ item.risk }}</Badge>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           8. LAB INTELLIGENCE
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

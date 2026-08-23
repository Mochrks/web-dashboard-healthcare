<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Medical Records" description="Electronic Health Records (EHR) Hub">
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total EHR Files" subtitle="All registered files">
          <template #title-icon><file-text class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">
            {{ hospitalStore.patients.length }}
          </div>
        </Card>
        <Card title="Active Encounters" subtitle="Open clinical encounters">
          <template #title-icon><clipboard-check class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">
            {{ hospitalStore.patients.filter((p) => p.condition === 'Critical').length }}
          </div>
        </Card>
        <Card title="Pending Reviews" subtitle="Awaiting physician sign-off">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">3</div>
        </Card>
        <Card title="FHIR Sync Status" subtitle="HL7 gateway connection">
          <template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">OK</div>
        </Card>
      </div>

      <Card
        title="Electronic Health Records Timeline"
        subtitle="Patient encounter history and clinical documents"
      >
        <template #title-icon><file-text class="w-4 h-4 text-med-primary" /></template>
        <div class="flex flex-col gap-3 mt-2">
          <div
            v-for="pat in hospitalStore.patients"
            :key="pat.id"
            class="p-4 bg-med-card-sec/40 dark:bg-med-card-sec/40 border border-med-border hover:border-med-primary/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 cursor-pointer group"
            @click="handleEhr(pat)"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-xl bg-med-primary/10 border border-med-primary/20 flex items-center justify-center text-xs font-bold text-med-primary"
              >
                {{
                  pat.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                }}
              </div>
              <div>
                <span class="text-xs font-bold text-med-text block">{{ pat.name }}</span>
                <span class="text-xxs text-med-text-muted"
                  >MRN: {{ pat.mrn }} • {{ pat.department }} • Bed {{ pat.bed }}</span
                >
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex flex-col items-end text-right">
                <span class="text-xxs text-med-text-muted">Last Updated</span>
                <span class="text-xxs font-mono text-med-text font-semibold">{{
                  pat.admittedAt
                }}</span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <Badge v-for="diag in pat.diagnoses.slice(0, 2)" :key="diag" variant="outline">{{
                  diag
                }}</Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                class="h-7 text-xxs py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >View EHR</Button
              >
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           3. ADMISSIONS & DISCHARGES (ADT)
           ==================================================== -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
  FileText,
  ClipboardCheck,
  AlertTriangle
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

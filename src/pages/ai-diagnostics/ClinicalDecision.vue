<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Clinical Decision" description="Drug Interactions & Treatment protocols">
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
        <Card title="Drug Checks Run" subtitle="Interactions screened today">
          <template #title-icon><pill class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">24</div>
        </Card>
        <Card title="Interactions Flagged" subtitle="Caution alerts triggered">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">1</div>
        </Card>
        <Card title="Protocols Active" subtitle="Clinical guidelines loaded">
          <template #title-icon><clipboard-check class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">12</div>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Drug Interaction Checker" subtitle="Real-time formulary conflict alerts">
          <template #title-icon><pill class="w-4 h-4 text-med-primary" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              class="p-3.5 bg-med-success/5 border border-med-success/20 rounded-xl flex items-center justify-between"
            >
              <div>
                <span class="text-xs font-bold text-med-text block"
                  >Epinephrine Allergen Check</span
                >
                <span class="text-xxs text-med-text-muted"
                  >No patient allergen conflicts across active census</span
                >
              </div>
              <Badge variant="success">PASS</Badge>
            </div>
            <div
              class="p-3.5 bg-med-warning/5 border border-med-warning/20 rounded-xl flex items-center justify-between"
            >
              <div>
                <span class="text-xs font-bold text-med-text block"
                  >Heparin & Aspirin Combination</span
                >
                <span class="text-xxs text-med-text-muted"
                  >Combined anticoagulation risk for Sarah Jenkins</span
                >
              </div>
              <Badge variant="esi2">WARN</Badge>
            </div>
            <div
              class="p-3.5 bg-med-success/5 border border-med-success/20 rounded-xl flex items-center justify-between"
            >
              <div>
                <span class="text-xs font-bold text-med-text block">Protocol Dosing Checker</span>
                <span class="text-xxs text-med-text-muted"
                  >All dosages matched HL7 clinical guidelines</span
                >
              </div>
              <Badge variant="success">PASS</Badge>
            </div>
          </div>
        </Card>
        <Card title="Clinical Protocol Library" subtitle="Active treatment bundles and guidelines">
          <template #title-icon><brain-circuit class="w-4 h-4 text-med-purple" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              v-for="protocol in clinicalProtocols"
              :key="protocol.name"
              class="p-3.5 bg-med-card-sec/40 border border-med-border hover:border-med-purple/30 rounded-xl flex items-center justify-between transition-all duration-300"
            >
              <div>
                <span class="text-xs font-bold text-med-text block">{{ protocol.name }}</span>
                <span class="text-xxs text-med-text-muted">{{ protocol.desc }}</span>
              </div>
              <Badge :variant="protocol.active ? 'purple' : 'outline'">{{
                protocol.active ? 'ACTIVE' : 'STANDBY'
              }}</Badge>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           11. BED MANAGEMENT
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
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Pill,
  AlertTriangle,
  ClipboardCheck,
  BrainCircuit
} from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const clinicalProtocols = ref([
  { name: 'Sepsis 3-Hour Bundle', desc: 'Lactate, BCx, Broad-spectrum Abx, Fluids', active: true },
  { name: 'Stroke (Code Brain)', desc: 'NIHSS, Non-con CT head, tPA screening', active: false },
  { name: 'ACS / STEMI', desc: 'ECG, Aspirin, P2Y12, Heparin, Cath Lab activation', active: true }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

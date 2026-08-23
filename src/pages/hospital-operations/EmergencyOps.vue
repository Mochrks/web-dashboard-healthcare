<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Emergency Operations" description="Emergency Room Triage Queue (ESI)">
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
        <Card title="ER Queue Total" subtitle="Active triage cases">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">
            {{ hospitalStore.stats.emergencyPatientsCount }}
          </div>
        </Card>
        <Card title="ESI-1 Critical" subtitle="Immediate resuscitation">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
          <div class="text-3xl font-extrabold text-med-danger font-mono mt-2 animate-pulse">1</div>
        </Card>
        <Card title="ESI-2 Emergent" subtitle="High risk patients">
          <template #title-icon><alert-triangle class="w-4 h-4 text-[#FF6B00]" /></template>
          <div class="text-3xl font-extrabold text-[#FF6B00] font-mono mt-2">
            {{ hospitalStore.stats.triage1_2 }}
          </div>
        </Card>
        <Card title="Avg Wait Time" subtitle="Door-to-provider">
          <template #title-icon><clock class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">18m</div>
        </Card>
      </div>

      <Card title="Emergency Triage Board" subtitle="Live ESI queue sorted by acuity level">
        <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
        <div class="flex flex-col gap-3 mt-2">
          <div
            v-for="pat in hospitalStore.patients.filter(
              (p) => p.department === 'Emergency' || p.department === 'ICU'
            )"
            :key="pat.id"
            :class="[
              'p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-300',
              pat.triage === 'ESI-1'
                ? 'bg-med-danger/5 border-med-danger/25 hover:shadow-alert-glow'
                : pat.triage === 'ESI-2'
                  ? 'bg-[#FF6B00]/5 border-[#FF6B00]/20'
                  : 'bg-med-card-sec/40 border-med-border'
            ]"
          >
            <div class="flex items-center gap-3">
              <span
                class="w-3 h-3 rounded-full"
                :class="
                  pat.triage === 'ESI-1'
                    ? 'bg-med-danger animate-ping'
                    : pat.triage === 'ESI-2'
                      ? 'bg-[#FF6B00] animate-pulse'
                      : 'bg-med-warning'
                "
              ></span>
              <div>
                <span class="text-xs font-bold text-med-text">{{ pat.name }}</span>
                <span class="text-xxs text-med-text-muted block"
                  >{{ pat.chiefComplaint }} • Bed {{ pat.bed }}</span
                >
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Badge
                :variant="
                  pat.triage === 'ESI-1' ? 'esi1' : pat.triage === 'ESI-2' ? 'esi2' : 'esi3'
                "
                >{{ pat.triage }}</Badge
              >
              <Badge :variant="pat.condition === 'Critical' ? 'danger' : 'warning'">{{
                pat.condition
              }}</Badge>
              <span class="text-xxs text-med-text-muted font-mono"
                >Att: {{ pat.attendingPhysician }}</span
              >
            </div>
          </div>
        </div>
      </Card>

      <!-- ====================================================
           13. SURGERY MANAGEMENT
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
import { Activity, Search, Filter, RefreshCw, AlertTriangle, Clock } from 'lucide-vue-next'

const hospitalStore = useHospitalStore()
const searchQuery = ref('')
const isRefreshing = ref(false)

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

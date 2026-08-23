<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Demographics Analytics" description="Length-of-Stay Analytics">
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
        <Card title="Total Census Count" subtitle="Registered cases">
          <template #title-icon><users class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">
            {{ hospitalStore.patients.length }}
          </div>
        </Card>
        <Card title="Emergency Cases" subtitle="Triage active counts">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">
            {{ hospitalStore.patients.filter((p) => p.department === 'Emergency').length }}
          </div>
        </Card>
        <Card title="Critical Care (ICU)" subtitle="ICU active counts">
          <template #title-icon><hotel class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">
            {{ hospitalStore.patients.filter((p) => p.department === 'ICU').length }}
          </div>
        </Card>
      </div>

      <Card title="Patient Registry" subtitle="Active clinical cases index">
        <template #title-icon><users class="w-4 h-4 text-med-primary" /></template>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr class="border-b border-med-border text-med-text-muted font-bold">
                <th class="py-3 px-4">Patient Name</th>
                <th class="py-3 px-4">Age/Sex</th>
                <th class="py-3 px-4">MRN</th>
                <th class="py-3 px-4">Condition</th>
                <th class="py-3 px-4">Triage</th>
                <th class="py-3 px-4">Bed</th>
                <th class="py-3 px-4">Chief Complaint</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-med-border/50">
              <tr
                v-for="pat in filteredPatients"
                :key="pat.id"
                class="hover:bg-med-card-sec/45 transition-colors group"
              >
                <td class="py-3.5 px-4 font-semibold text-med-text">{{ pat.name }}</td>
                <td class="py-3.5 px-4 text-med-text-muted">{{ pat.age }} / {{ pat.gender[0] }}</td>
                <td class="py-3.5 px-4 text-med-text-muted font-mono">{{ pat.mrn }}</td>
                <td class="py-3.5 px-4">
                  <Badge :variant="pat.condition === 'Critical' ? 'esi1' : 'esi3'">
                    {{ pat.condition }}
                  </Badge>
                </td>
                <td class="py-3.5 px-4">
                  <Badge
                    :variant="
                      pat.triage === 'ESI-1' ? 'esi1' : pat.triage === 'ESI-2' ? 'esi2' : 'outline'
                    "
                  >
                    {{ pat.triage }}
                  </Badge>
                </td>
                <td class="py-3.5 px-4 text-med-teal font-semibold font-mono">{{ pat.bed }}</td>
                <td class="py-3.5 px-4 text-med-text-muted max-w-[200px] truncate">
                  {{ pat.chiefComplaint }}
                </td>
                <td class="py-3.5 px-4 text-right">
                  <div
                    class="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      class="h-7 text-xxs py-1"
                      @click="handleEhr(pat)"
                      >EHR</Button
                    >
                    <Button
                      size="sm"
                      variant="danger"
                      class="h-7 text-xxs py-1"
                      @click="hospitalStore.dischargePatient(pat.id)"
                      >Discharge</Button
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- ====================================================
           2. MEDICAL RECORDS (EHR Hub)
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
import { Activity, Search, Filter, RefreshCw, Users, AlertTriangle, Hotel } from 'lucide-vue-next'

const hospitalStore = useHospitalStore()
const searchQuery = ref('')
const isRefreshing = ref(false)

const filteredPatients = computed(() => {
  if (!searchQuery.value) return hospitalStore.patients
  return hospitalStore.patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

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

<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Staff Operations" description="Clinical Shift Schedules & Burnout Index">
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
        <Card title="On-Duty Staff" subtitle="Active clinicians">
          <template #title-icon><user-square class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">28</div>
        </Card>
        <Card title="ED Nurse Density" subtitle="Patient-to-nurse ratio">
          <template #title-icon><users class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">1:5</div>
        </Card>
        <Card title="Avg Shift Hours" subtitle="Current rotation">
          <template #title-icon><clock class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">12.5h</div>
        </Card>
        <Card title="Burnout Index" subtitle="Staff fatigue alert">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
          <div class="text-3xl font-extrabold text-med-danger font-mono mt-2 animate-pulse">
            78%
          </div>
        </Card>
      </div>

      <Card
        title="Clinical Staff Roster & Shift Board"
        subtitle="Active duty assignments and fatigue monitoring"
      >
        <template #title-icon><user-square class="w-4 h-4 text-med-primary" /></template>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr class="border-b border-med-border text-med-text-muted font-bold">
                <th class="py-3 px-4">Staff Member</th>
                <th class="py-3 px-4">Role</th>
                <th class="py-3 px-4">Department</th>
                <th class="py-3 px-4">Shift</th>
                <th class="py-3 px-4">Hours Active</th>
                <th class="py-3 px-4">Fatigue Level</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-med-border/50">
              <tr
                v-for="staff in staffRoster"
                :key="staff.name"
                class="hover:bg-med-card-sec/45 transition-colors"
              >
                <td class="py-3.5 px-4 font-semibold text-med-text">{{ staff.name }}</td>
                <td class="py-3.5 px-4 text-med-text-muted">{{ staff.role }}</td>
                <td class="py-3.5 px-4 text-med-text-muted">{{ staff.dept }}</td>
                <td class="py-3.5 px-4 font-mono text-med-text-muted">{{ staff.shift }}</td>
                <td class="py-3.5 px-4 font-mono text-med-text">{{ staff.hours }}h</td>
                <td class="py-3.5 px-4">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-16 bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1.5 overflow-hidden"
                    >
                      <div
                        class="h-full rounded-full"
                        :class="
                          staff.fatigue > 70
                            ? 'bg-med-danger'
                            : staff.fatigue > 40
                              ? 'bg-med-warning'
                              : 'bg-med-success'
                        "
                        :style="{ width: `${staff.fatigue}%` }"
                      ></div>
                    </div>
                    <span
                      class="text-xxs font-mono"
                      :class="staff.fatigue > 70 ? 'text-med-danger' : 'text-med-text-muted'"
                      >{{ staff.fatigue }}%</span
                    >
                  </div>
                </td>
                <td class="py-3.5 px-4">
                  <Badge :variant="staff.status === 'Active' ? 'success' : 'outline'">{{
                    staff.status
                  }}</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- ====================================================
           15. FACILITY MONITORING
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

<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <PageHeader title="Appointments" description="Outpatient Scheduler & Availability">
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
        <Card title="Today's Schedule" subtitle="Total appointments">
          <template #title-icon><calendar class="w-4 h-4 text-med-primary" /></template>
          <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">18</div>
        </Card>
        <Card title="Completed" subtitle="Finished consultations">
          <template #title-icon><check-circle class="w-4 h-4 text-med-success" /></template>
          <div class="text-3xl font-extrabold text-med-success font-mono mt-2">11</div>
        </Card>
        <Card title="Upcoming" subtitle="Next 3 hours">
          <template #title-icon><clock class="w-4 h-4 text-med-teal" /></template>
          <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">5</div>
        </Card>
        <Card title="Cancellation Rate" subtitle="AI predicted risk">
          <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
          <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">8.2%</div>
        </Card>
      </div>

      <Card title="Outpatient Schedule Board" subtitle="Appointment schedule for today">
        <template #title-icon><calendar class="w-4 h-4 text-med-primary" /></template>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr class="border-b border-med-border text-med-text-muted font-bold">
                <th class="py-3 px-4">Time</th>
                <th class="py-3 px-4">Patient</th>
                <th class="py-3 px-4">Department</th>
                <th class="py-3 px-4">Physician</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-med-border/50">
              <tr
                v-for="appt in appointmentSchedule"
                :key="appt.time"
                class="hover:bg-med-card-sec/45 transition-colors"
              >
                <td class="py-3.5 px-4 font-mono font-bold text-med-primary">{{ appt.time }}</td>
                <td class="py-3.5 px-4 font-semibold text-med-text">{{ appt.patient }}</td>
                <td class="py-3.5 px-4 text-med-text-muted">{{ appt.dept }}</td>
                <td class="py-3.5 px-4 text-med-text-muted">{{ appt.doctor }}</td>
                <td class="py-3.5 px-4">
                  <Badge variant="outline">{{ appt.type }}</Badge>
                </td>
                <td class="py-3.5 px-4">
                  <Badge
                    :variant="
                      appt.status === 'Completed'
                        ? 'success'
                        : appt.status === 'In Progress'
                          ? 'info'
                          : 'outline'
                    "
                    >{{ appt.status }}</Badge
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- ====================================================
           5. TELEMEDICINE
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
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-vue-next'

const searchQuery = ref('')
const isRefreshing = ref(false)

const appointmentSchedule = ref([
  {
    time: '09:00 AM',
    patient: 'Michael Chang',
    dept: 'Cardiology',
    doctor: 'Dr. Evelyn Carter',
    type: 'Follow-up',
    status: 'Completed'
  },
  {
    time: '10:30 AM',
    patient: 'Sarah Jenkins',
    dept: 'Pulmonology',
    doctor: 'Dr. Aisha Rahman',
    type: 'Consultation',
    status: 'In Progress'
  },
  {
    time: '11:15 AM',
    patient: 'Robert Chen',
    dept: 'Neurology',
    doctor: 'Dr. Marcus Webb',
    type: 'Initial',
    status: 'Scheduled'
  }
])

const triggerRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}
</script>

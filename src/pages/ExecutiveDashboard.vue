<template>
  <div class="flex flex-col gap-6 select-none">
    <!-- Header and Weather Correlation banner -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
      <div>
        <h2
          class="text-[40px] font-serif font-normal text-ink-black tracking-tight flex items-center gap-2 leading-tight"
        >
          Clinical Operations Command
        </h2>
        <p class="text-sm text-slate-mid mt-2 font-sans">
          Realtime healthcare analytics, predictive risk logs, and facility sensor networks.
        </p>
      </div>

      <!-- Live weather correlation metric -->
      <div
        class="flex items-center gap-3 bg-pure-white border border-transparent rounded-xl px-4 py-3 text-xxs text-slate-mid shadow-floating transition-all duration-300"
      >
        <thermometer class="w-4 h-4 text-forest-grove animate-pulse" />
        <div class="text-left font-sans">
          <div class="font-bold text-forest-grove text-[10px] tracking-widest uppercase mb-0.5">
            WEATHER-ADMISSION RATIO
          </div>
          <div class="text-xs text-ink-black">74°F Rain • Suspected Respiratory Spike (+12.4%)</div>
        </div>
      </div>
    </div>

    <!-- Tier 1: Core KPI Card Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card title="ICU Occupancy Rate" subtitle="Active intensive beds" :hover-glow="false">
        <template #title-icon>
          <div
            class="w-8 h-8 rounded-full bg-mist-gray flex items-center justify-center shrink-0 border border-graphite/10"
          >
            <hotel class="w-4 h-4 text-forest-grove" />
          </div>
        </template>
        <div class="flex items-baseline justify-between mt-4">
          <span class="text-[40px] font-semibold tracking-tight text-ink-black">
            {{ stats.icuOccupancyRate }}%
          </span>
          <Badge variant="stable" :dot="true" :pulse="true">Nominal</Badge>
        </div>
        <div
          class="w-full bg-neutral-100 dark:bg-neutral-900 rounded-full h-1.5 mt-5 overflow-hidden"
        >
          <div
            class="bg-med-teal h-full rounded-full transition-all duration-500"
            :style="{ width: `${stats.icuOccupancyRate}%` }"
          ></div>
        </div>
        <div class="flex items-center justify-between text-xs text-med-text-muted mt-3">
          <span>{{ stats.occupiedBeds }} Occupied</span>
          <span>{{ stats.totalBeds }} Total Beds</span>
        </div>
      </Card>

      <Card title="Emergency ER Queue" subtitle="Active ESI triage" :hover-glow="true">
        <template #title-icon>
          <div
            class="w-8 h-8 rounded-full bg-med-warning/10 flex items-center justify-center shrink-0"
          >
            <alert-triangle class="w-4 h-4 text-med-warning" />
          </div>
        </template>
        <div class="flex items-baseline justify-between mt-4">
          <span class="text-4xl font-semibold tracking-tight text-med-text">
            {{ stats.emergencyPatientsCount }}
          </span>
          <Badge variant="esi2" :dot="true">Surge Level</Badge>
        </div>
        <div class="flex items-center gap-2 mt-5 text-xs text-med-text-muted">
          <span class="w-2 h-2 rounded-full bg-med-danger animate-pulse"></span>
          <span>{{ stats.triage1_2 }} Critical Cases (ESI 1-2)</span>
        </div>
      </Card>

      <Card
        title="Active Critical Alarms"
        subtitle="Telemetry warning triggers"
        :hover-glow-danger="stats.activeCriticalAlerts > 0"
      >
        <template #title-icon>
          <div
            class="w-8 h-8 rounded-full bg-med-danger/10 flex items-center justify-center shrink-0"
          >
            <bell class="w-4 h-4 text-med-danger" />
          </div>
        </template>
        <div class="flex items-baseline justify-between mt-4">
          <span
            :class="[
              'text-4xl font-semibold tracking-tight transition-all duration-300',
              stats.activeCriticalAlerts > 0 ? 'text-med-danger animate-pulse' : 'text-med-text'
            ]"
          >
            {{ stats.activeCriticalAlerts }}
          </span>
          <Badge
            :variant="stats.activeCriticalAlerts > 0 ? 'esi1' : 'outline'"
            :pulse="stats.activeCriticalAlerts > 0"
          >
            {{ stats.activeCriticalAlerts > 0 ? 'Action Req' : 'Clear' }}
          </Badge>
        </div>
        <div class="text-xs text-med-text-muted mt-5 truncate">
          {{
            stats.activeCriticalAlerts > 0
              ? 'ICU Arrhythmia Alert Active'
              : 'All channels fully clear'
          }}
        </div>
      </Card>

      <Card title="Admissions Flow" subtitle="Patient turnaround today" :hover-glow="true">
        <template #title-icon>
          <div
            class="w-8 h-8 rounded-full bg-med-primary/10 flex items-center justify-center shrink-0"
          >
            <activity class="w-4 h-4 text-med-primary" />
          </div>
        </template>
        <div class="flex items-baseline justify-between mt-4">
          <span class="text-4xl font-semibold tracking-tight text-med-text">
            {{ stats.dailyAdmissions
            }}<span class="text-2xl text-med-text-muted">/{{ stats.dailyDischarges }}</span>
          </span>
          <Badge variant="info">Net +4</Badge>
        </div>
        <div class="flex items-center justify-between text-xs text-med-text-muted mt-5">
          <span>Admitted: {{ stats.dailyAdmissions }}</span>
          <span>Discharged: {{ stats.dailyDischarges }}</span>
        </div>
      </Card>
    </div>

    <!-- Tier 2: Realtime ECG Monitor & Predictive Insights -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Critical patient live vitals monitor -->
      <Card
        title="Live Patient Telemetry"
        subtitle="Sarah Jenkins (Bed ICU-A4) • STEMI Post-Op Monitor"
        class="lg:col-span-2"
        :hover-glow="true"
      >
        <template #title-icon><activity-square class="w-4 h-4 text-med-primary" /></template>
        <template #header-action>
          <router-link to="/realtime-monitor">
            <Button size="sm" variant="outline">Full Screen Monitor</Button>
          </router-link>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <ECGMonitor
            :heart-rate="sarahHeartRate"
            label="ECG II (Lead II)"
            color="#22C55E"
            vitals-type="ecg"
          />
          <ECGMonitor
            :heart-rate="sarahHeartRate"
            label="ART (Arterial Line)"
            color="#EF4444"
            vitals-type="abp"
          />
        </div>

        <div
          class="bg-red-50 border border-red-100 rounded-xl p-4 mt-5 flex items-center justify-between gap-4 animate-pulse shadow-sm"
        >
          <div class="flex items-center gap-3">
            <alert-triangle class="w-5 h-5 text-red-500" />
            <div class="text-left select-none font-sans">
              <span class="font-bold text-ink-black block text-xs"
                >CRITICAL TELEMETRY TRIGGER: Sarah Jenkins</span
              >
              <span class="text-slate-mid text-xs"
                >Ventricular Tachycardia burst detected. Sepsis onset score stands at 7 (High risk
                of decompensation).</span
              >
            </div>
          </div>
          <router-link to="/ai-diagnosis">
            <Button size="sm" variant="danger">AI Consultation</Button>
          </router-link>
        </div>
      </Card>

      <!-- AI Insights and predictive congestion panel -->
      <Card
        title="Aether AI Diagnostics"
        subtitle="Congestion & clinical forecasts"
        :hover-glow-ai="true"
      >
        <template #title-icon><brain-circuit class="w-4 h-4 text-med-purple" /></template>
        <div class="flex flex-col gap-4 mt-2">
          <!-- Sepsis predictive risk warning -->
          <div
            class="bg-med-card-sec border border-med-border p-3.5 rounded-xl text-left select-none"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-med-text flex items-center gap-1.5">
                <shield-alert class="w-3.5 h-3.5 text-med-purple animate-pulse" />
                Sepsis Predictor (qSOFA)
              </span>
              <Badge variant="esi1">High Risk</Badge>
            </div>
            <p class="text-xxs text-med-text-muted mt-2 leading-relaxed">
              Model predicts sepsis onset within 3 hours for Sarah Jenkins with 88% confidence.
              Recommended antibiotics: Piperacillin.
            </p>
          </div>

          <!-- ED Congestion advisory -->
          <div
            class="bg-med-card-sec border border-med-border p-3.5 rounded-xl text-left select-none"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-med-text flex items-center gap-1.5">
                <users class="w-3.5 h-3.5 text-med-teal" />
                Staff Workload Advisory
              </span>
              <Badge variant="esi3">Caution</Badge>
            </div>
            <p class="text-xxs text-med-text-muted mt-2 leading-relaxed">
              Nurse-to-patient ratio in Emergency Department is currently 1:5 (Optimum: 1:3). Staff
              burnout rating is elevated (78%).
            </p>
            <div class="flex justify-end mt-3">
              <router-link to="/staff-operations">
                <Button size="sm" variant="outline" class="text-xxs py-1 h-7"
                  >Adjust Staff Rotations</Button
                >
              </router-link>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Tier 3: Surgical Scheduler, Doctor Availabilities, and Live Timeline Feed -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- OR / Surgical Scheduling progress cards -->
      <Card
        title="Operating Room Suites"
        subtitle="Live surgery utilizations"
        class="lg:col-span-2"
        :hover-glow="true"
      >
        <template #title-icon><scissors class="w-4 h-4 text-med-teal" /></template>
        <template #header-action>
          <router-link to="/surgery-management">
            <Button size="sm" variant="outline">OR Manager</Button>
          </router-link>
        </template>

        <div class="flex flex-col gap-3.5 mt-2">
          <div
            v-for="or in hospitalStore.operatingRooms"
            :key="or.id"
            class="p-4 bg-neutral-50 dark:bg-neutral-900 border border-transparent hover:border-med-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 select-none text-left hover:shadow-apple-subtle hover:-translate-y-0.5"
          >
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span class="text-[13px] font-semibold text-med-text">{{ or.name }}</span>
                <Badge
                  :variant="
                    or.status === 'Intra-Op'
                      ? 'danger'
                      : or.status === 'Cleaning'
                        ? 'warning'
                        : 'success'
                  "
                  size="sm"
                >
                  {{ or.status }}
                </Badge>
              </div>
              <div class="text-[10px] text-med-text-muted">
                <span v-if="or.procedure !== 'None'"
                  >{{ or.procedure }} • Surgeon: {{ or.surgeon }}</span
                >
                <span v-else>Suite clean and fully ready for emergency surgical staging</span>
              </div>
            </div>

            <!-- Timing progress bar -->
            <div v-if="or.status === 'Intra-Op'" class="w-full md:w-48 flex flex-col gap-1.5">
              <div
                class="flex items-center justify-between font-mono text-[10px] text-med-text-muted"
              >
                <span>Progress</span>
                <span>{{ or.timeElapsedMin }}/{{ or.estimatedTimeMin }} min</span>
              </div>
              <div
                class="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden"
              >
                <div
                  class="bg-med-danger h-full rounded-full transition-all duration-500"
                  :style="{ width: `${(or.timeElapsedMin / or.estimatedTimeMin) * 100}%` }"
                ></div>
              </div>
            </div>

            <div v-else-if="or.status === 'Cleaning'" class="w-full md:w-48 flex flex-col gap-1.5">
              <div
                class="flex items-center justify-between font-mono text-[10px] text-med-text-muted"
              >
                <span>Sanitization cycle</span>
                <span>{{ or.timeElapsedMin }}/30 min</span>
              </div>
              <div
                class="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden animate-pulse"
              >
                <div
                  class="bg-med-warning h-full rounded-full transition-all duration-500"
                  :style="{ width: `${(or.timeElapsedMin / 30) * 100}%` }"
                ></div>
              </div>
            </div>

            <div v-else>
              <router-link to="/emergency-ops">
                <Button size="sm" variant="outline" class="text-xxs"
                  >Stage Emergency Appendectomy</Button
                >
              </router-link>
            </div>
          </div>
        </div>
      </Card>

      <!-- Live Timeline Activity Feed -->
      <Card title="Activity Center" subtitle="HIPAA gateways and ER admissions" :hover-glow="true">
        <template #title-icon><clock class="w-4 h-4 text-med-primary" /></template>
        <template #header-action>
          <router-link to="/notifications">
            <Button size="sm" variant="outline">Full History</Button>
          </router-link>
        </template>
        <LiveTimeline />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHospitalStore } from '../stores/hospitalStore'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import Button from '../components/ui/Button.vue'
import ECGMonitor from '../components/dashboard/ECGMonitor.vue'
import LiveTimeline from '../components/dashboard/LiveTimeline.vue'
import {
  Activity,
  ActivitySquare,
  AlertTriangle,
  Bell,
  BrainCircuit,
  Clock,
  Hotel,
  Scissors,
  ShieldAlert,
  Thermometer,
  Users
} from 'lucide-vue-next'

const hospitalStore = useHospitalStore()

const stats = computed(() => hospitalStore.stats)

// Access patient Sarah Jenkins' live fluctuating heart rate to feed our ECG graphs
const sarahHeartRate = computed(() => {
  const sarah = hospitalStore.patients.find((p) => p.id === 'pat-1')
  return sarah ? sarah.vitals.heartRate : 110
})
</script>

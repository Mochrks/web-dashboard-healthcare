<template>
  <div class="flex flex-col gap-6 select-none text-left">
    <!-- Dynamic Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-med-border/40 pb-5"
    >
      <div>
        <h2 class="text-2xl font-extrabold text-med-text tracking-tight flex items-center gap-2">
          <component :is="activeIcon" class="w-6 h-6 text-med-primary" />
          {{ meta.title }}
        </h2>
        <p class="text-xs text-med-text-muted mt-1">{{ meta.description }}</p>
      </div>
      <div class="flex items-center gap-2">
        <Badge :variant="meta.badgeVariant" :dot="true" :pulse="true">
          {{ meta.statusText }}
        </Badge>
        <span
          class="text-xxs px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-950/20 text-med-text-muted border border-med-border font-mono uppercase"
        >
          SECURE CHANNEL
        </span>
      </div>
    </div>

    <!-- Active Search, Tabs and Filter Section -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-med-card border border-med-border p-4 rounded-2xl"
    >
      <div class="relative flex items-center flex-1 max-w-md">
        <search-icon class="absolute left-3 w-4 h-4 text-med-text-muted" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="`Search ${meta.title.toLowerCase()} records...`"
          class="w-full bg-med-card-sec border border-med-border focus:border-med-primary rounded-xl py-2 pl-10 pr-4 text-xs text-med-text placeholder-med-text-muted outline-none transition-colors"
        />
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <Button size="sm" variant="outline">
          <filter-icon class="w-3.5 h-3.5" />
          <span>Filters</span>
        </Button>
        <Button size="sm" variant="outline" @click="triggerRefresh" :loading="isRefreshing">
          <refresh-cw class="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
        </Button>
      </div>
    </div>

    <!-- SKELETON SHIMMER STATE -->
    <div v-if="isRefreshing" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card v-for="n in 3" :key="n" :loading="true" class="h-64"></Card>
    </div>

    <!-- DYNAMIC ROUTE VIEW RENDERERS -->
    <div v-else class="transition-all duration-300">
      <!-- ====================================================
           1. PATIENTS DATABASE & ANALYTICS
           ==================================================== -->
      <div v-if="path === '/patients' || path === '/patient-analytics'" class="flex flex-col gap-6">
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
                  <td class="py-3.5 px-4 text-med-text-muted">
                    {{ pat.age }} / {{ pat.gender[0] }}
                  </td>
                  <td class="py-3.5 px-4 text-med-text-muted font-mono">{{ pat.mrn }}</td>
                  <td class="py-3.5 px-4">
                    <Badge :variant="pat.condition === 'Critical' ? 'esi1' : 'esi3'">
                      {{ pat.condition }}
                    </Badge>
                  </td>
                  <td class="py-3.5 px-4">
                    <Badge
                      :variant="
                        pat.triage === 'ESI-1'
                          ? 'esi1'
                          : pat.triage === 'ESI-2'
                            ? 'esi2'
                            : 'outline'
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
      </div>

      <!-- ====================================================
           2. MEDICAL RECORDS (EHR Hub)
           ==================================================== -->
      <div v-else-if="path === '/medical-records'" class="flex flex-col gap-6">
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
      </div>

      <!-- ====================================================
           3. ADMISSIONS & DISCHARGES (ADT)
           ==================================================== -->
      <div v-else-if="path === '/admissions-discharges'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Today's Admissions" subtitle="Inbound patients">
            <template #title-icon><user-plus class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">
              {{ hospitalStore.stats.dailyAdmissions }}
            </div>
          </Card>
          <Card title="Today's Discharges" subtitle="Cleared for exit">
            <template #title-icon><door-open class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">
              {{ hospitalStore.stats.dailyDischarges }}
            </div>
          </Card>
          <Card title="Ambulances En Route" subtitle="Incoming transport">
            <template #title-icon
              ><alert-triangle class="w-4 h-4 text-med-danger animate-pulse"
            /></template>
            <div class="text-3xl font-extrabold text-med-danger font-mono mt-2">2</div>
          </Card>
          <Card title="Bed Turnaround" subtitle="Avg cleaning cycle">
            <template #title-icon><clock class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">38m</div>
          </Card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Incoming Transfer Queue" subtitle="Ambulance and inter-facility transfers">
            <template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
            <div class="flex flex-col gap-3 mt-2">
              <div
                class="p-3.5 bg-med-danger/5 border border-med-danger/20 rounded-xl flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-med-danger animate-ping"></span>
                  <div>
                    <span class="text-xs font-bold text-med-text block">AMB-042 Chest Pain</span>
                    <span class="text-xxs text-med-text-muted"
                      >ESI-2 • ETA 4 minutes • Prep Trauma Bay 1</span
                    >
                  </div>
                </div>
                <Badge variant="esi2">ESI-2</Badge>
              </div>
              <div
                class="p-3.5 bg-med-card-sec/40 border border-med-border rounded-xl flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-med-warning"></span>
                  <div>
                    <span class="text-xs font-bold text-med-text block"
                      >AMB-118 Orthopedic Laceration</span
                    >
                    <span class="text-xxs text-med-text-muted">ESI-3 • ETA 12 minutes</span>
                  </div>
                </div>
                <Badge variant="esi3">ESI-3</Badge>
              </div>
            </div>
          </Card>

          <Card title="Discharge Clearance Board" subtitle="Patients cleared for discharge today">
            <template #title-icon><door-open class="w-4 h-4 text-med-teal" /></template>
            <div class="flex flex-col gap-3 mt-2">
              <div
                class="p-3.5 bg-med-success/5 border border-med-success/20 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span class="text-xs font-bold text-med-text block">Elena Rostova</span>
                  <span class="text-xxs text-med-text-muted"
                    >Post-op cholecystectomy • Cleared by Dr. Lin</span
                  >
                </div>
                <Badge variant="success">READY</Badge>
              </div>
              <div
                class="p-3.5 bg-med-warning/5 border border-med-warning/20 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span class="text-xs font-bold text-med-text block">James Peterson</span>
                  <span class="text-xxs text-med-text-muted"
                    >COPD monitoring • Pending respiratory clearance</span
                  >
                </div>
                <Badge variant="warning">PENDING</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- ====================================================
           4. APPOINTMENTS
           ==================================================== -->
      <div v-else-if="path === '/appointments'" class="flex flex-col gap-6">
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
      </div>

      <!-- ====================================================
           5. TELEMEDICINE
           ==================================================== -->
      <div v-else-if="path === '/telemedicine'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      </div>

      <!-- ====================================================
           6. AI DIAGNOSIS ASSISTANT
           ==================================================== -->
      <div v-else-if="path === '/ai-diagnosis'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Active Diagnoses" subtitle="Running model inferences">
            <template #title-icon><stethoscope class="w-4 h-4 text-med-purple" /></template>
            <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">3</div>
          </Card>
          <Card title="Avg Model Confidence" subtitle="Across all active cases">
            <template #title-icon><brain-circuit class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">91.4%</div>
          </Card>
          <Card title="Cases Resolved Today" subtitle="AI-assisted closures">
            <template #title-icon><check-circle class="w-4 h-4 text-med-success" /></template>
            <div class="text-3xl font-extrabold text-med-success font-mono mt-2">7</div>
          </Card>
        </div>

        <Card
          title="Differential Diagnosis Console"
          subtitle="AI-generated diagnostic assessments with confidence scores"
        >
          <template #title-icon><brain-circuit class="w-4 h-4 text-med-purple" /></template>
          <div class="flex flex-col gap-4 mt-2">
            <div
              v-for="dx in differentialDiagnoses"
              :key="dx.patient"
              class="p-4 bg-med-card-sec/40 border border-med-border hover:border-med-purple/30 rounded-xl transition-all duration-300"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-med-text flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="dx.conf >= 90 ? 'bg-med-danger animate-pulse' : 'bg-med-warning'"
                  ></span>
                  {{ dx.patient }}
                </span>
                <Badge :variant="dx.conf >= 90 ? 'esi1' : 'esi3'">{{ dx.conf }}% Confidence</Badge>
              </div>
              <p class="text-xxs text-med-text-muted leading-relaxed mb-3">{{ dx.assessment }}</p>
              <div
                class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1.5 border border-med-border/40 overflow-hidden"
              >
                <div
                  class="bg-med-purple h-full rounded-full transition-all duration-500"
                  :style="{ width: `${dx.conf}%` }"
                ></div>
              </div>
              <div class="flex items-center justify-between mt-3 text-xxs text-med-text-muted">
                <span>ICD-10: {{ dx.icd }}</span>
                <span class="text-med-purple font-semibold">{{ dx.recommendation }}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           7. MEDICAL IMAGING AI (DICOM)
           ==================================================== -->
      <div v-else-if="path === '/medical-imaging'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                class="absolute w-full h-[2px] bg-med-purple shadow-ai-glow animate-bounce top-0"
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
      </div>

      <!-- ====================================================
           8. LAB INTELLIGENCE
           ==================================================== -->
      <div v-else-if="path === '/lab-intelligence'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Pending Panels" subtitle="Lab work in queue">
            <template #title-icon><clipboard-check class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">6</div>
          </Card>
          <Card title="Critical Results" subtitle="Flagged abnormal values">
            <template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
            <div class="text-3xl font-extrabold text-med-danger font-mono mt-2 animate-pulse">
              2
            </div>
          </Card>
          <Card title="Avg Turnaround" subtitle="Sample to result">
            <template #title-icon><clock class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">42m</div>
          </Card>
          <Card title="Quality Score" subtitle="QC index for today">
            <template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
            <div class="text-3xl font-extrabold text-med-success font-mono mt-2">99.2%</div>
          </Card>
        </div>

        <Card
          title="Blood Panel & Chemistry Results"
          subtitle="Hematology electrolyte and biomarker results feed"
        >
          <template #title-icon><clipboard-check class="w-4 h-4 text-med-primary" /></template>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr class="border-b border-med-border text-med-text-muted font-bold">
                  <th class="py-3 px-4">Patient</th>
                  <th class="py-3 px-4">Test Panel</th>
                  <th class="py-3 px-4">Result</th>
                  <th class="py-3 px-4">Normal Range</th>
                  <th class="py-3 px-4">Flag</th>
                  <th class="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-med-border/50">
                <tr
                  v-for="lab in labResults"
                  :key="lab.test"
                  class="hover:bg-med-card-sec/45 transition-colors"
                >
                  <td class="py-3.5 px-4 font-semibold text-med-text">{{ lab.patient }}</td>
                  <td class="py-3.5 px-4 text-med-text-muted">{{ lab.test }}</td>
                  <td
                    class="py-3.5 px-4 font-mono font-bold"
                    :class="lab.flagged ? 'text-med-danger' : 'text-med-text'"
                  >
                    {{ lab.result }}
                  </td>
                  <td class="py-3.5 px-4 text-med-text-muted font-mono">{{ lab.range }}</td>
                  <td class="py-3.5 px-4">
                    <Badge :variant="lab.flagged ? 'esi1' : 'success'">{{
                      lab.flagged ? 'CRITICAL' : 'NORMAL'
                    }}</Badge>
                  </td>
                  <td class="py-3.5 px-4">
                    <Badge variant="outline">{{ lab.status }}</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           9. PREDICTIVE RISK ENGINE
           ==================================================== -->
      <div v-else-if="path === '/predictive-risk'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="High Risk Patients" subtitle="Decompensation alerts">
            <template #title-icon><shield-alert class="w-4 h-4 text-med-danger" /></template>
            <div class="text-3xl font-extrabold text-med-danger font-mono mt-2 animate-pulse">
              2
            </div>
          </Card>
          <Card title="Avg qSOFA Score" subtitle="Across ICU census">
            <template #title-icon><activity class="w-4 h-4 text-med-purple" /></template>
            <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">5.4</div>
          </Card>
          <Card title="30-Day Readmission" subtitle="Population avg risk">
            <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">14.2%</div>
          </Card>
        </div>

        <Card
          title="Patient Risk Stratification Matrix"
          subtitle="AI predictive models for sepsis onset, cardiac arrest, and readmission"
        >
          <template #title-icon><shield-alert class="w-4 h-4 text-med-purple" /></template>
          <div class="flex flex-col gap-4 mt-2">
            <div
              v-for="pat in hospitalStore.patients"
              :key="pat.id"
              class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-med-text"
                  >{{ pat.name }} • Bed {{ pat.bed }}</span
                >
                <Badge
                  :variant="pat.riskScore >= 70 ? 'esi1' : pat.riskScore >= 40 ? 'esi2' : 'success'"
                >
                  {{
                    pat.riskScore >= 70
                      ? 'HIGH RISK'
                      : pat.riskScore >= 40
                        ? 'MODERATE'
                        : 'LOW RISK'
                  }}
                </Badge>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-xxs">
                <div>
                  <span class="text-med-text-muted block">Sepsis (qSOFA)</span>
                  <span
                    class="font-bold font-mono"
                    :class="pat.riskScore >= 70 ? 'text-med-danger animate-pulse' : 'text-med-text'"
                    >{{ pat.riskScore }}%</span
                  >
                  <div
                    class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1 mt-1 overflow-hidden"
                  >
                    <div
                      class="h-full rounded-full transition-all"
                      :class="pat.riskScore >= 70 ? 'bg-med-danger' : 'bg-med-teal'"
                      :style="{ width: `${pat.riskScore}%` }"
                    ></div>
                  </div>
                </div>
                <div>
                  <span class="text-med-text-muted block">Readmission 30d</span>
                  <span class="font-bold font-mono text-med-warning"
                    >{{ pat.readmissionRisk }}%</span
                  >
                  <div
                    class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1 mt-1 overflow-hidden"
                  >
                    <div
                      class="bg-med-warning h-full rounded-full transition-all"
                      :style="{ width: `${pat.readmissionRisk}%` }"
                    ></div>
                  </div>
                </div>
                <div>
                  <span class="text-med-text-muted block">Cardiac Arrest</span>
                  <span class="font-bold font-mono text-med-purple"
                    >{{ Math.round(pat.riskScore * 0.18) }}%</span
                  >
                  <div
                    class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1 mt-1 overflow-hidden"
                  >
                    <div
                      class="bg-med-purple h-full rounded-full transition-all"
                      :style="{ width: `${pat.riskScore * 0.18}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           10. CLINICAL DECISION SUPPORT
           ==================================================== -->
      <div v-else-if="path === '/clinical-decision'" class="flex flex-col gap-6">
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
          <Card
            title="Clinical Protocol Library"
            subtitle="Active treatment bundles and guidelines"
          >
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
      </div>

      <!-- ====================================================
           11. BED MANAGEMENT
           ==================================================== -->
      <div v-else-if="path === '/bed-management'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="ICU Unit Beds" subtitle="Occupied: 4/6">
            <div class="text-2xl font-extrabold text-med-teal font-mono mt-2">66.6%</div>
          </Card>
          <Card title="Emergency Unit Beds" subtitle="Occupied: 7/10">
            <div class="text-2xl font-extrabold text-med-warning font-mono mt-2">70.0%</div>
          </Card>
          <Card title="Med-Surg Beds" subtitle="Occupied: 12/20">
            <div class="text-2xl font-extrabold text-med-primary font-mono mt-2">60.0%</div>
          </Card>
          <Card title="Average Turnaround" subtitle="Cleaning turnaround rate">
            <div class="text-2xl font-extrabold text-med-teal font-mono mt-2">38.4 min</div>
          </Card>
        </div>

        <Card title="Bed Layout Map" subtitle="Unit ward spatial telemetry grid (ICU & ED)">
          <template #title-icon><hotel class="w-4 h-4 text-med-teal" /></template>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-2">
            <div
              v-for="bed in hospitalStore.beds"
              :key="bed.id"
              :class="[
                'p-4 rounded-xl border flex flex-col gap-2 relative transition-all duration-300 text-left select-none',
                bed.status === 'Occupied'
                  ? 'bg-med-primary/5 border-med-primary/20 hover:border-med-primary/45 hover:shadow-med-glow'
                  : bed.status === 'Dirty'
                    ? 'bg-med-danger/5 border-med-danger/20 hover:border-med-danger/45 hover:shadow-alert-glow'
                    : bed.status === 'Reserved'
                      ? 'bg-med-warning/5 border-med-warning/20 hover:border-med-warning/45 hover:shadow-med-glow'
                      : 'bg-med-card-sec border-med-border hover:border-med-teal/45'
              ]"
            >
              <div class="flex items-center justify-between text-xxs font-bold">
                <span class="text-med-text">{{ bed.room }}</span>
                <span
                  :class="[
                    'w-2 h-2 rounded-full',
                    bed.status === 'Occupied'
                      ? 'bg-med-primary'
                      : bed.status === 'Dirty'
                        ? 'bg-med-danger animate-pulse'
                        : bed.status === 'Reserved'
                          ? 'bg-med-warning'
                          : 'bg-med-teal'
                  ]"
                ></span>
              </div>
              <div class="text-[9px] text-med-text-muted mt-2">
                <span v-if="bed.patientName" class="font-bold text-med-text block truncate">{{
                  bed.patientName
                }}</span>
                <span v-else class="block">{{ bed.status }}</span>
                <span class="block mt-1 font-mono">T: {{ bed.turnaroundTimeMin }}m</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           12. EMERGENCY OPERATIONS (TRIAGE)
           ==================================================== -->
      <div v-else-if="path === '/emergency-ops'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="ER Queue Total" subtitle="Active triage cases">
            <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">
              {{ hospitalStore.stats.emergencyPatientsCount }}
            </div>
          </Card>
          <Card title="ESI-1 Critical" subtitle="Immediate resuscitation">
            <template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
            <div class="text-3xl font-extrabold text-med-danger font-mono mt-2 animate-pulse">
              1
            </div>
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
      </div>

      <!-- ====================================================
           13. SURGERY MANAGEMENT
           ==================================================== -->
      <div v-else-if="path === '/surgery-management'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Active OR Suites" subtitle="Currently in use">
            <template #title-icon><scissors class="w-4 h-4 text-med-danger" /></template>
            <div class="text-3xl font-extrabold text-med-danger font-mono mt-2">
              {{ hospitalStore.operatingRooms.filter((o) => o.status === 'Intra-Op').length }}
            </div>
          </Card>
          <Card title="Scheduled Today" subtitle="Total procedures">
            <template #title-icon><calendar class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">
              {{ hospitalStore.operatingRooms.length }}
            </div>
          </Card>
          <Card title="Avg Duration" subtitle="Procedure time">
            <template #title-icon><clock class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">2.4h</div>
          </Card>
          <Card title="Utilization Rate" subtitle="OR throughput">
            <template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
            <div class="text-3xl font-extrabold text-med-success font-mono mt-2">78%</div>
          </Card>
        </div>

        <Card
          title="Operating Room Suite Status Board"
          subtitle="Live OR status, surgeon assignments, and timing"
        >
          <template #title-icon><scissors class="w-4 h-4 text-med-teal" /></template>
          <div class="flex flex-col gap-3.5 mt-2">
            <div
              v-for="or in hospitalStore.operatingRooms"
              :key="or.id"
              class="p-4 bg-med-card-sec/45 border border-med-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-med-primary/30 transition-all duration-300"
            >
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-med-text">{{ or.name }}</span>
                  <Badge
                    :variant="
                      or.status === 'Intra-Op'
                        ? 'danger'
                        : or.status === 'Cleaning'
                          ? 'warning'
                          : 'success'
                    "
                    size="sm"
                    >{{ or.status }}</Badge
                  >
                </div>
                <div class="text-[10px] text-med-text-muted">
                  <span v-if="or.procedure !== 'None'"
                    >{{ or.procedure }} • Surgeon: {{ or.surgeon }}</span
                  >
                  <span v-else>Suite clean and ready for emergency staging</span>
                </div>
              </div>
              <div v-if="or.status === 'Intra-Op'" class="w-full md:w-48 flex flex-col gap-1">
                <div
                  class="flex items-center justify-between font-mono text-[9px] text-med-text-muted"
                >
                  <span>Progress</span>
                  <span>{{ or.timeElapsedMin }}/{{ or.estimatedTimeMin }} min</span>
                </div>
                <div
                  class="w-full bg-neutral-200 dark:bg-neutral-950/40 border border-med-border/40 rounded-full h-1.5 overflow-hidden"
                >
                  <div
                    class="bg-med-danger h-full rounded-full transition-all duration-500"
                    :style="{ width: `${(or.timeElapsedMin / or.estimatedTimeMin) * 100}%` }"
                  ></div>
                </div>
              </div>
              <div v-else-if="or.status === 'Cleaning'" class="w-full md:w-48 flex flex-col gap-1">
                <div
                  class="flex items-center justify-between font-mono text-[9px] text-med-text-muted"
                >
                  <span>Sanitization</span>
                  <span>{{ or.timeElapsedMin }}/30 min</span>
                </div>
                <div
                  class="w-full bg-neutral-200 dark:bg-neutral-950/40 border border-med-border/40 rounded-full h-1.5 overflow-hidden animate-pulse"
                >
                  <div
                    class="bg-med-warning h-full rounded-full transition-all duration-500"
                    :style="{ width: `${(or.timeElapsedMin / 30) * 100}%` }"
                  ></div>
                </div>
              </div>
              <div v-else>
                <Button size="sm" variant="outline" class="text-xxs">Stage Emergency</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           14. STAFF OPERATIONS
           ==================================================== -->
      <div v-else-if="path === '/staff-operations'" class="flex flex-col gap-6">
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
      </div>

      <!-- ====================================================
           15. FACILITY MONITORING
           ==================================================== -->
      <div v-else-if="path === '/facility-monitoring'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Air Quality Index" subtitle="HVAC clean air exchanges">
            <template #title-icon><thermometer-sun class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">22/hr</div>
          </Card>
          <Card title="Avg Temperature" subtitle="Facility-wide">
            <template #title-icon><thermometer-sun class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">68.4°F</div>
          </Card>
          <Card title="Humidity Level" subtitle="Clean room compliance">
            <template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
            <div class="text-3xl font-extrabold text-med-success font-mono mt-2">45%</div>
          </Card>
          <Card title="Energy Score" subtitle="Efficiency rating">
            <template #title-icon><activity class="w-4 h-4 text-med-purple" /></template>
            <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">94.2%</div>
          </Card>
        </div>

        <Card
          title="Facility Sensor Grid"
          subtitle="Real-time environmental telemetry from all zones"
        >
          <template #title-icon><thermometer-sun class="w-4 h-4 text-med-primary" /></template>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            <div
              v-for="sensor in facilitySensors"
              :key="sensor.zone"
              class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl hover:border-med-primary/30 transition-all duration-300"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-med-text">{{ sensor.zone }}</span>
                <Badge :variant="sensor.status === 'Nominal' ? 'success' : 'warning'">{{
                  sensor.status
                }}</Badge>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center text-xxs">
                <div>
                  <span class="text-med-text-muted block">Temp</span>
                  <span class="font-bold font-mono text-med-text">{{ sensor.temp }}</span>
                </div>
                <div>
                  <span class="text-med-text-muted block">Humidity</span>
                  <span class="font-bold font-mono text-med-text">{{ sensor.humidity }}</span>
                </div>
                <div>
                  <span class="text-med-text-muted block">Air Exch.</span>
                  <span class="font-bold font-mono text-med-teal">{{ sensor.airExchange }}/hr</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           16. ASSET TRACKING
           ==================================================== -->
      <div v-else-if="path === '/asset-tracking'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Tracked Assets" subtitle="RFID tagged equipment">
            <template #title-icon><compass class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">156</div>
          </Card>
          <Card title="Online" subtitle="Active RFID signal">
            <template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
            <div class="text-3xl font-extrabold text-med-success font-mono mt-2">149</div>
          </Card>
          <Card title="Maintenance" subtitle="Under servicing">
            <template #title-icon><settings class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">5</div>
          </Card>
          <Card title="Battery Alerts" subtitle="Low charge warning">
            <template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
            <div class="text-3xl font-extrabold text-med-danger font-mono mt-2">2</div>
          </Card>
        </div>

        <Card
          title="Equipment RFID Location Grid"
          subtitle="Real-time medical device tracking system"
        >
          <template #title-icon><compass class="w-4 h-4 text-med-primary" /></template>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            <div
              v-for="asset in assetList"
              :key="asset.id"
              class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl hover:border-med-teal/30 transition-all duration-300"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-med-text">{{ asset.name }}</span>
                <Badge
                  :variant="
                    asset.battery > 50 ? 'success' : asset.battery > 20 ? 'warning' : 'danger'
                  "
                  >{{ asset.battery }}%</Badge
                >
              </div>
              <div class="text-xxs text-med-text-muted space-y-1">
                <div class="flex justify-between">
                  <span>RFID:</span><span class="font-mono text-med-text">{{ asset.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Location:</span
                  ><span class="font-semibold text-med-teal">{{ asset.location }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Last Calibration:</span
                  ><span class="font-mono">{{ asset.calibrated }}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           17. PHARMACY
           ==================================================== -->
      <div v-else-if="path === '/pharmacy'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Formulary Items" subtitle="Active medications">
            <template #title-icon><pill class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">342</div>
          </Card>
          <Card title="Critical Low" subtitle="Below threshold">
            <template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
            <div class="text-3xl font-extrabold text-med-danger font-mono mt-2 animate-pulse">
              1
            </div>
          </Card>
          <Card title="Dispensed Today" subtitle="Total scripts filled">
            <template #title-icon><activity class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">47</div>
          </Card>
          <Card title="Pending Orders" subtitle="Awaiting fulfillment">
            <template #title-icon><clock class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">3</div>
          </Card>
        </div>

        <Card
          title="Drug Inventory & Stock Levels"
          subtitle="Critical formulary reserves and dispensing monitor"
        >
          <template #title-icon><pill class="w-4 h-4 text-med-primary" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              v-for="drug in pharmacyInventory"
              :key="drug.name"
              :class="[
                'p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all',
                drug.critical
                  ? 'bg-med-danger/5 border-med-danger/20'
                  : 'bg-med-card-sec/40 border-med-border'
              ]"
            >
              <div>
                <span class="text-xs font-bold text-med-text block">{{ drug.name }}</span>
                <span class="text-xxs text-med-text-muted">{{ drug.desc }}</span>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-32 flex flex-col gap-1">
                  <div
                    class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-1.5 overflow-hidden"
                  >
                    <div
                      class="h-full rounded-full transition-all"
                      :class="drug.critical ? 'bg-med-danger animate-pulse' : 'bg-med-teal'"
                      :style="{ width: `${drug.pct}%` }"
                    ></div>
                  </div>
                  <span class="text-[9px] font-mono text-med-text-muted text-right">{{
                    drug.stock
                  }}</span>
                </div>
                <Badge :variant="drug.critical ? 'esi1' : 'success'">{{
                  drug.critical ? 'CRITICAL LOW' : 'IN STOCK'
                }}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           18. INVENTORY MANAGEMENT
           ==================================================== -->
      <div v-else-if="path === '/inventory'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="PPE Reserves" subtitle="Surgical masks & gloves">
            <template #title-icon><package-check class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">450</div>
            <div class="text-xxs text-med-text-muted mt-1">boxes available</div>
          </Card>
          <Card title="Medical O₂ Gas" subtitle="Cryogenic reserves">
            <template #title-icon><activity class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">84%</div>
            <div class="text-xxs text-med-text-muted mt-1">tank capacity</div>
          </Card>
          <Card title="Surgical Kits" subtitle="Sterile drape kits">
            <template #title-icon><scissors class="w-4 h-4 text-med-success" /></template>
            <div class="text-3xl font-extrabold text-med-success font-mono mt-2">120</div>
            <div class="text-xxs text-med-text-muted mt-1">kits in reserve</div>
          </Card>
          <Card title="Reorder Alerts" subtitle="Automated triggers">
            <template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">0</div>
            <div class="text-xxs text-med-success mt-1">All supply nominal</div>
          </Card>
        </div>

        <Card
          title="Supply Chain Monitor"
          subtitle="PPE, medical gas, and surgical supply reserves"
        >
          <template #title-icon><package-check class="w-4 h-4 text-med-primary" /></template>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div
              v-for="item in inventoryItems"
              :key="item.name"
              class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl"
            >
              <span class="text-xs font-bold text-med-text block mb-2">{{ item.name }}</span>
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="flex-1 bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="h-full rounded-full bg-med-teal transition-all"
                    :style="{ width: `${item.pct}%` }"
                  ></div>
                </div>
                <span class="text-xxs font-mono font-bold text-med-text">{{ item.pct }}%</span>
              </div>
              <div class="text-xxs text-med-text-muted">{{ item.desc }}</div>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           19. LAB OPERATIONS
           ==================================================== -->
      <div v-else-if="path === '/lab-operations'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Specimens Pending" subtitle="In pathology queue">
            <template #title-icon><clipboard-check class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">6</div>
          </Card>
          <Card title="Centrifuges Active" subtitle="Lab equipment status">
            <template #title-icon><activity class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">2/3</div>
          </Card>
          <Card title="Turnaround Time" subtitle="Avg specimen to result">
            <template #title-icon><clock class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">48m</div>
          </Card>
          <Card title="Centrifuge Temp" subtitle="Lab-C2 cooling">
            <template #title-icon><thermometer-sun class="w-4 h-4 text-med-danger" /></template>
            <div class="text-3xl font-extrabold text-med-danger font-mono mt-2 animate-pulse">
              4.2°C
            </div>
            <div class="text-xxs text-med-danger mt-1">Above 4°C max threshold!</div>
          </Card>
        </div>

        <Card
          title="Specimen Processing Pipeline"
          subtitle="Pathology centrifuge calibration and queue"
        >
          <template #title-icon><clipboard-check class="w-4 h-4 text-med-primary" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              class="p-3.5 bg-med-danger/5 border border-med-danger/20 rounded-xl flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-med-danger animate-pulse"></span>
                <div>
                  <span class="text-xs font-bold text-med-text block">Centrifuge Lab-C2</span>
                  <span class="text-xxs text-med-text-muted"
                    >Cooling unit malfunction! Temp 4.2°C exceeds 4°C max</span
                  >
                </div>
              </div>
              <Badge variant="esi2">ALERT</Badge>
            </div>
            <div
              class="p-3.5 bg-med-success/5 border border-med-success/20 rounded-xl flex items-center justify-between"
            >
              <div>
                <span class="text-xs font-bold text-med-text block">Centrifuge Lab-C3</span>
                <span class="text-xxs text-med-text-muted"
                  >Fully calibrated. Pathology streams active</span
                >
              </div>
              <Badge variant="success">NOMINAL</Badge>
            </div>
            <div
              class="p-3.5 bg-med-card-sec/40 border border-med-border rounded-xl flex items-center justify-between"
            >
              <div>
                <span class="text-xs font-bold text-med-text block">Specimen Queue</span>
                <span class="text-xxs text-med-text-muted"
                  >6 blood panels pending biochemistry processing</span
                >
              </div>
              <Badge variant="outline">6 PENDING</Badge>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           20. BILLING & PAYMENTS
           ==================================================== -->
      <div v-else-if="path === '/billing'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Revenue Today" subtitle="Total collected">
            <template #title-icon><landmark class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">$84.2K</div>
          </Card>
          <Card title="Outstanding" subtitle="Pending payments">
            <template #title-icon><receipt class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">$63.0K</div>
          </Card>
          <Card title="Collected Rate" subtitle="Payment success">
            <template #title-icon><activity class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">92.4%</div>
          </Card>
          <Card title="Avg Claim Value" subtitle="Per patient invoice">
            <template #title-icon><bar-chart class="w-4 h-4 text-med-purple" /></template>
            <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">$14.8K</div>
          </Card>
        </div>

        <Card
          title="Patient Invoice Ledger"
          subtitle="Revenue cycle billing and reconciliation records"
        >
          <template #title-icon><landmark class="w-4 h-4 text-med-primary" /></template>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr class="border-b border-med-border text-med-text-muted font-bold">
                  <th class="py-3 px-4">Patient</th>
                  <th class="py-3 px-4">Service</th>
                  <th class="py-3 px-4">Amount</th>
                  <th class="py-3 px-4">Insurance</th>
                  <th class="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-med-border/50">
                <tr
                  v-for="inv in invoices"
                  :key="inv.patient"
                  class="hover:bg-med-card-sec/45 transition-colors"
                >
                  <td class="py-3.5 px-4 font-semibold text-med-text">{{ inv.patient }}</td>
                  <td class="py-3.5 px-4 text-med-text-muted">{{ inv.service }}</td>
                  <td class="py-3.5 px-4 font-mono font-bold text-med-text">{{ inv.amount }}</td>
                  <td class="py-3.5 px-4 text-med-text-muted">{{ inv.insurance }}</td>
                  <td class="py-3.5 px-4">
                    <Badge
                      :variant="
                        inv.status === 'CLEARED'
                          ? 'success'
                          : inv.status === 'PENDING'
                            ? 'warning'
                            : 'outline'
                      "
                      >{{ inv.status }}</Badge
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           21. INSURANCE CLAIMS
           ==================================================== -->
      <div v-else-if="path === '/claims'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Submitted" subtitle="Total claims filed"
            ><template #title-icon><receipt class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">24</div></Card
          >
          <Card title="Approved" subtitle="Insurance cleared"
            ><template #title-icon><check-circle class="w-4 h-4 text-med-success" /></template>
            <div class="text-3xl font-extrabold text-med-success font-mono mt-2">19</div></Card
          >
          <Card title="Denied" subtitle="Requires appeal"
            ><template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
            <div class="text-3xl font-extrabold text-med-danger font-mono mt-2">3</div></Card
          >
          <Card title="Appealed" subtitle="Under review"
            ><template #title-icon><clock class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">2</div></Card
          >
        </div>

        <Card
          title="Claims Audit Trail"
          subtitle="Prior-authorization, denial audits, and appeal status"
        >
          <template #title-icon><receipt class="w-4 h-4 text-med-primary" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              v-for="claim in claimsList"
              :key="claim.id"
              :class="[
                'p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3',
                claim.status === 'DENIED'
                  ? 'bg-med-danger/5 border-med-danger/20'
                  : claim.status === 'APPEALED'
                    ? 'bg-med-warning/5 border-med-warning/20'
                    : 'bg-med-card-sec/40 border-med-border'
              ]"
            >
              <div>
                <span class="text-xs font-bold text-med-text block"
                  >{{ claim.id }}: {{ claim.patient }}</span
                >
                <span class="text-xxs text-med-text-muted">{{ claim.desc }}</span>
              </div>
              <Badge
                :variant="
                  claim.status === 'APPROVED'
                    ? 'success'
                    : claim.status === 'DENIED'
                      ? 'esi1'
                      : 'esi2'
                "
                >{{ claim.status }}</Badge
              >
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           22. FINANCIAL ANALYTICS
           ==================================================== -->
      <div v-else-if="path === '/financial-analytics'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Monthly Revenue" subtitle="Gross income"
            ><template #title-icon><bar-chart class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">$2.4M</div></Card
          >
          <Card title="Operating Margin" subtitle="Net profit ratio"
            ><template #title-icon><activity class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">18.5%</div></Card
          >
          <Card title="Cost Per Case" subtitle="Avg expenditure"
            ><template #title-icon><landmark class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">$8.2K</div></Card
          >
          <Card title="Budget Usage" subtitle="Utilization rate"
            ><template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
            <div class="text-3xl font-extrabold text-med-success font-mono mt-2">76%</div></Card
          >
        </div>

        <Card title="Department Margin Analysis" subtitle="Operating margins by department">
          <template #title-icon><bar-chart class="w-4 h-4 text-med-primary" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              v-for="dept in deptMargins"
              :key="dept.name"
              class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-med-text">{{ dept.name }}</span>
                <span
                  class="text-xs font-bold font-mono"
                  :class="dept.margin >= 0 ? 'text-med-success' : 'text-med-danger'"
                  >{{ dept.margin >= 0 ? '+' : '' }}{{ dept.margin }}%</span
                >
              </div>
              <div
                class="w-full bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-2 overflow-hidden"
              >
                <div
                  class="h-full rounded-full transition-all"
                  :class="dept.margin >= 0 ? 'bg-med-teal' : 'bg-med-danger'"
                  :style="{ width: `${Math.abs(dept.margin) * 2}%` }"
                ></div>
              </div>
              <span class="text-xxs text-med-text-muted mt-1 block">{{ dept.desc }}</span>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           23. SECURITY CENTER (HIPAA)
           ==================================================== -->
      <div v-else-if="path === '/security-center'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
          <Card title="Encryption Level" subtitle="Access tunnels status"
            ><template #title-icon><lock class="w-4 h-4 text-med-primary" /></template>
            <div class="text-2xl font-extrabold text-med-primary font-mono mt-2">
              AES-256 GCM
            </div></Card
          >
          <Card title="HIPAA Incidents" subtitle="Suspicious triggers"
            ><template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
            <div class="text-2xl font-extrabold text-med-danger font-mono mt-2">
              1 Flagged
            </div></Card
          >
          <Card title="User Sessions" subtitle="Active terminals"
            ><template #title-icon><users class="w-4 h-4 text-med-teal" /></template>
            <div class="text-2xl font-extrabold text-med-teal font-mono mt-2">42 active</div></Card
          >
        </div>

        <Card title="HIPAA Access Audit Ledger" subtitle="EHR read/write event records catalog">
          <template #title-icon><lock class="w-4 h-4 text-med-primary" /></template>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs select-none">
              <thead>
                <tr class="border-b border-med-border text-med-text-muted font-bold">
                  <th class="py-3 px-4">User</th>
                  <th class="py-3 px-4">Role</th>
                  <th class="py-3 px-4">Action</th>
                  <th class="py-3 px-4">Resource</th>
                  <th class="py-3 px-4">IP Address</th>
                  <th class="py-3 px-4">Timestamp</th>
                  <th class="py-3 px-4">HIPAA Audit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-med-border/50">
                <tr
                  v-for="log in hospitalStore.securityLogs"
                  :key="log.id"
                  class="hover:bg-med-card-sec/45 transition-colors"
                >
                  <td class="py-3.5 px-4 font-semibold text-med-text">{{ log.user }}</td>
                  <td class="py-3.5 px-4 text-med-text-muted">{{ log.role }}</td>
                  <td class="py-3.5 px-4 text-med-text-muted">{{ log.action }}</td>
                  <td class="py-3.5 px-4 text-med-text-muted font-mono">{{ log.resource }}</td>
                  <td class="py-3.5 px-4 text-med-text-muted font-mono">{{ log.ipAddress }}</td>
                  <td class="py-3.5 px-4 text-med-text-muted font-mono">{{ log.timestamp }}</td>
                  <td class="py-3.5 px-4">
                    <Badge :variant="log.hipaaFlag ? 'esi1' : 'success'">{{
                      log.hipaaFlag ? 'FLAGGED' : 'OK'
                    }}</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           24. COMPLIANCE & AUDIT
           ==================================================== -->
      <div v-else-if="path === '/compliance'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Audit Score" subtitle="Overall compliance"
            ><template #title-icon><landmark class="w-4 h-4 text-med-success" /></template>
            <div class="text-3xl font-extrabold text-med-success font-mono mt-2">98.4%</div></Card
          >
          <Card title="Active Certs" subtitle="Valid certifications"
            ><template #title-icon><check-circle class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">14</div></Card
          >
          <Card title="Policies Due" subtitle="Renewal within 90d"
            ><template #title-icon><clock class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">2</div></Card
          >
          <Card title="Last Audit" subtitle="Joint Commission"
            ><template #title-icon><clipboard-check class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">Gold</div></Card
          >
        </div>

        <Card
          title="Regulatory Compliance Checklist"
          subtitle="Accreditation audit trail and policy renewals"
        >
          <template #title-icon><landmark class="w-4 h-4 text-med-primary" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              v-for="item in complianceItems"
              :key="item.name"
              class="p-3.5 bg-med-card-sec/40 border border-med-border rounded-xl flex items-center justify-between hover:border-med-primary/30 transition-all"
            >
              <div class="flex items-center gap-3">
                <check-circle v-if="item.passed" class="w-4 h-4 text-med-success" />
                <clock v-else class="w-4 h-4 text-med-warning" />
                <div>
                  <span class="text-xs font-bold text-med-text block">{{ item.name }}</span>
                  <span class="text-xxs text-med-text-muted">{{ item.desc }}</span>
                </div>
              </div>
              <Badge :variant="item.passed ? 'success' : 'warning'">{{
                item.passed ? 'VALID' : 'DUE'
              }}</Badge>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           25. MESSAGES & COLLABORATION
           ==================================================== -->
      <div v-else-if="path === '/messages'" class="flex flex-col gap-6">
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

          <Card
            title="Active Thread"
            subtitle="Encrypted clinical discussion"
            class="lg:col-span-2"
          >
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
      </div>

      <!-- ====================================================
           26. NOTIFICATIONS CENTER
           ==================================================== -->
      <div v-else-if="path === '/notifications'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total Alerts" subtitle="All time today"
            ><template #title-icon><bell class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">42</div></Card
          >
          <Card title="Critical" subtitle="Require action"
            ><template #title-icon><alert-triangle class="w-4 h-4 text-med-danger" /></template>
            <div class="text-3xl font-extrabold text-med-danger font-mono mt-2">
              {{ hospitalStore.stats.activeCriticalAlerts }}
            </div></Card
          >
          <Card title="Warnings" subtitle="Advisory notices"
            ><template #title-icon><alert-triangle class="w-4 h-4 text-med-warning" /></template>
            <div class="text-3xl font-extrabold text-med-warning font-mono mt-2">8</div></Card
          >
          <Card title="Informational" subtitle="Log events"
            ><template #title-icon><info class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">31</div></Card
          >
        </div>

        <Card
          title="Operations Alert Feed"
          subtitle="Filtered alert stream from all clinical systems"
        >
          <template #title-icon><bell class="w-4 h-4 text-med-primary" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              v-for="alt in hospitalStore.alerts"
              :key="alt.id"
              :class="[
                'p-4 rounded-xl border flex items-start gap-3 transition-all',
                alt.level === 'critical'
                  ? 'bg-med-danger/5 border-med-danger/20'
                  : 'bg-med-warning/5 border-med-warning/20'
              ]"
            >
              <span
                class="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                :class="alt.level === 'critical' ? 'bg-med-danger animate-ping' : 'bg-med-warning'"
              ></span>
              <div class="flex-1">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-xs font-bold text-med-text">{{ alt.title }}</span>
                  <span class="text-[9px] text-med-text-muted font-mono">{{ alt.timestamp }}</span>
                </div>
                <p class="text-xxs text-med-text-muted mt-1 leading-relaxed">{{ alt.message }}</p>
              </div>
              <Badge :variant="alt.level === 'critical' ? 'esi1' : 'warning'">{{
                alt.level.toUpperCase()
              }}</Badge>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           27. REPORTS & ANALYTICS
           ==================================================== -->
      <div v-else-if="path === '/reports'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Reports Generated" subtitle="This month"
            ><template #title-icon><file-spreadsheet class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">34</div></Card
          >
          <Card title="Scheduled Reports" subtitle="Auto-generated"
            ><template #title-icon><clock class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">8</div></Card
          >
          <Card title="Export Formats" subtitle="Supported outputs"
            ><template #title-icon><file-spreadsheet class="w-4 h-4 text-med-purple" /></template>
            <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">
              CSV / PDF / FHIR
            </div></Card
          >
        </div>

        <Card
          title="Report Builder Console"
          subtitle="Generate custom analytics reports and data exports"
        >
          <template #title-icon><file-spreadsheet class="w-4 h-4 text-med-primary" /></template>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div
              v-for="report in reportTypes"
              :key="report.name"
              class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl hover:border-med-primary/30 transition-all duration-300 cursor-pointer group"
            >
              <div class="flex items-center gap-3 mb-2">
                <div
                  class="w-8 h-8 rounded-lg bg-med-primary/10 border border-med-primary/20 flex items-center justify-center"
                >
                  <file-spreadsheet class="w-4 h-4 text-med-primary" />
                </div>
                <div>
                  <span
                    class="text-xs font-bold text-med-text group-hover:text-med-primary transition-colors"
                    >{{ report.name }}</span
                  >
                  <span class="text-xxs text-med-text-muted block">{{ report.desc }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between text-xxs text-med-text-muted mt-2">
                <span>Last generated: {{ report.last }}</span>
                <Button size="sm" variant="outline" class="h-6 text-xxs py-0.5">Generate</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           28. API & INTEGRATIONS
           ==================================================== -->
      <div v-else-if="path === '/api-integrations'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Active Endpoints" subtitle="API listeners"
            ><template #title-icon><webhook class="w-4 h-4 text-med-primary" /></template>
            <div class="text-3xl font-extrabold text-med-primary font-mono mt-2">6</div></Card
          >
          <Card title="Webhooks" subtitle="Event subscribers"
            ><template #title-icon><webhook class="w-4 h-4 text-med-teal" /></template>
            <div class="text-3xl font-extrabold text-med-teal font-mono mt-2">4</div></Card
          >
          <Card title="Uptime" subtitle="API availability"
            ><template #title-icon><activity class="w-4 h-4 text-med-success" /></template>
            <div class="text-3xl font-extrabold text-med-success font-mono mt-2">99.97%</div></Card
          >
          <Card title="Avg Latency" subtitle="Response time"
            ><template #title-icon><clock class="w-4 h-4 text-med-purple" /></template>
            <div class="text-3xl font-extrabold text-med-purple font-mono mt-2">72ms</div></Card
          >
        </div>

        <Card
          title="HL7 / FHIR API Gateway Status"
          subtitle="Active webhook listeners and integration endpoints"
        >
          <template #title-icon><webhook class="w-4 h-4 text-med-primary" /></template>
          <div class="flex flex-col gap-3 mt-2">
            <div
              v-for="api in apiEndpoints"
              :key="api.name"
              class="p-4 bg-med-card-sec/40 border border-med-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-med-primary/30 transition-all"
            >
              <div class="flex items-center gap-3">
                <span
                  class="w-2.5 h-2.5 rounded-full"
                  :class="
                    api.status === 'Connected' ? 'bg-med-success' : 'bg-med-warning animate-pulse'
                  "
                ></span>
                <div>
                  <span class="text-xs font-bold text-med-text block">{{ api.name }}</span>
                  <span class="text-xxs text-med-text-muted">{{ api.desc }}</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xxs font-mono text-med-text-muted">{{ api.endpoint }}</span>
                <Badge :variant="api.status === 'Connected' ? 'success' : 'warning'">{{
                  api.status.toUpperCase()
                }}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- ====================================================
           29. SETTINGS
           ==================================================== -->
      <div v-else-if="path === '/settings'" class="flex flex-col gap-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Clinic Profile" subtitle="Organization settings">
            <template #title-icon><settings class="w-4 h-4 text-med-primary" /></template>
            <div class="flex flex-col gap-4 mt-2 text-xs">
              <div class="flex justify-between py-2 border-b border-med-border/40">
                <span class="text-med-text-muted">Organization</span
                ><span class="font-semibold text-med-text">Aether Medical Center</span>
              </div>
              <div class="flex justify-between py-2 border-b border-med-border/40">
                <span class="text-med-text-muted">License Type</span
                ><span class="font-semibold text-med-text">Enterprise (Unlimited)</span>
              </div>
              <div class="flex justify-between py-2 border-b border-med-border/40">
                <span class="text-med-text-muted">EHR System</span
                ><span class="font-semibold text-med-primary">Aether Clinical OS v3.5</span>
              </div>
              <div class="flex justify-between py-2 border-b border-med-border/40">
                <span class="text-med-text-muted">FHIR Version</span
                ><span class="font-semibold font-mono text-med-text">R4 (4.0.1)</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-med-text-muted">Timezone</span
                ><span class="font-semibold text-med-text">UTC-5 (Eastern)</span>
              </div>
            </div>
          </Card>

          <Card title="System Configuration" subtitle="Alert volumes and preferences">
            <template #title-icon><settings class="w-4 h-4 text-med-purple" /></template>
            <div class="flex flex-col gap-4 mt-2 text-xs">
              <div class="flex items-center justify-between py-2 border-b border-med-border/40">
                <span class="text-med-text-muted">Critical Alert Volume</span>
                <div class="flex items-center gap-2">
                  <div
                    class="w-24 bg-neutral-200 dark:bg-neutral-950/40 rounded-full h-2 overflow-hidden"
                  >
                    <div class="bg-med-danger h-full rounded-full" style="width: 85%"></div>
                  </div>
                  <span class="font-mono text-med-text font-bold">85%</span>
                </div>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-med-border/40">
                <span class="text-med-text-muted">Auto-Refresh Interval</span>
                <span class="font-semibold font-mono text-med-text">10 seconds</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-med-border/40">
                <span class="text-med-text-muted">Data Encryption</span>
                <Badge variant="success">AES-256 ACTIVE</Badge>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-med-border/40">
                <span class="text-med-text-muted">Two-Factor Auth</span>
                <Badge variant="success">ENABLED</Badge>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-med-text-muted">Session Timeout</span>
                <span class="font-semibold font-mono text-med-text">30 minutes</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- ====================================================
           GENERIC FALLBACK (should not be reached)
           ==================================================== -->
      <div v-else class="flex flex-col items-center justify-center py-20 gap-4">
        <check-circle class="w-12 h-12 text-med-teal animate-pulse" />
        <div class="text-center">
          <div class="text-sm font-bold text-med-text">Module Loading</div>
          <div class="text-xs text-med-text-muted mt-1">
            This clinical module is being prepared for deployment.
          </div>
        </div>
      </div>
    </div>

    <!-- EHR Details Modal Dialog -->
    <Dialog
      :is-open="isEhrOpen"
      :title="`Electronic Health Record: ${selectedPatient?.name}`"
      @close="isEhrOpen = false"
      size="lg"
    >
      <div v-if="selectedPatient" class="flex flex-col gap-4 text-left text-xs">
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-3 bg-neutral-100 dark:bg-neutral-950/20 p-3 rounded-xl border border-med-border/40 select-none font-mono"
        >
          <div>
            <span class="text-xxs text-med-text-muted font-sans font-medium block">MRN:</span>
            {{ selectedPatient.mrn }}
          </div>
          <div>
            <span class="text-xxs text-med-text-muted font-sans font-medium block"
              >AGE / GENDER:</span
            >
            {{ selectedPatient.age }} / {{ selectedPatient.gender }}
          </div>
          <div>
            <span class="text-xxs text-med-text-muted font-sans font-medium block">ATTENDING:</span>
            {{ selectedPatient.attendingPhysician }}
          </div>
          <div>
            <span class="text-xxs text-med-text-muted font-sans font-medium block">TRIAGE:</span>
            {{ selectedPatient.triage }}
          </div>
        </div>

        <div>
          <span class="font-bold text-med-text block mb-1 text-xs select-none"
            >Diagnoses Summary</span
          >
          <div class="flex flex-wrap gap-1.5 mt-1">
            <Badge v-for="diag in selectedPatient.diagnoses" :key="diag" variant="outline">{{
              diag
            }}</Badge>
          </div>
        </div>

        <div>
          <span class="font-bold text-med-text block mb-1 text-xs select-none"
            >Prescribed Medications</span
          >
          <div class="flex flex-wrap gap-1.5 mt-1">
            <Badge v-for="med in selectedPatient.medications" :key="med" variant="purple">{{
              med
            }}</Badge>
          </div>
        </div>

        <div class="bg-med-purple/5 border border-med-purple/20 p-3.5 rounded-xl select-none mt-2">
          <span class="text-xxs font-bold text-med-purple uppercase tracking-wider block mb-1"
            >AI Predictive Health Index Summary</span
          >
          <div class="grid grid-cols-2 gap-4 mt-2">
            <div>
              <span class="text-xxs text-med-text-muted font-sans font-medium block"
                >Clinical Decompensation (Sepsis):</span
              >
              <span class="text-sm font-bold font-mono text-med-danger animate-pulse"
                >{{ selectedPatient.riskScore }}%</span
              >
            </div>
            <div>
              <span class="text-xxs text-med-text-muted font-sans font-medium block"
                >30-Day Readmission Risk:</span
              >
              <span class="text-sm font-bold font-mono text-med-warning"
                >{{ selectedPatient.readmissionRisk }}%</span
              >
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHospitalStore } from '../stores/hospitalStore'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import Button from '../components/ui/Button.vue'
import Dialog from '../components/ui/Dialog.vue'
import ECGMonitor from '../components/dashboard/ECGMonitor.vue'
import {
  Search as SearchIcon,
  Filter as FilterIcon,
  RefreshCw,
  Users,
  AlertTriangle,
  Hotel,
  Activity,
  FileHeart,
  Lock,
  CheckCircle,
  Video as VideoIcon,
  BrainCircuit,
  FileSpreadsheet,
  Pill,
  BarChart,
  Settings,
  Landmark,
  FileText,
  ClipboardCheck,
  UserPlus,
  DoorOpen,
  Calendar,
  Clock,
  Stethoscope,
  ShieldAlert,
  Scissors,
  UserSquare2 as UserSquare,
  ThermometerSun,
  Compass,
  PackageCheck,
  Receipt,
  MessageSquareDashed,
  Bell,
  Info,
  Webhook
} from 'lucide-vue-next'

const route = useRoute()
const hospitalStore = useHospitalStore()

const path = computed(() => route.path)
const searchQuery = ref('')
const isRefreshing = ref(false)

const isEhrOpen = ref(false)
const selectedPatient = ref<any>(null)

const isScanningImaging = ref(false)

const mriLogs = ref([
  { label: 'Primary Motor Cortex Lesion size', conf: '94.8% confidence', risk: 'High' },
  { label: 'Ventricular Cavity Ratio', conf: '88.5% confidence', risk: 'Moderate' },
  { label: 'Subdural fluid envelope thickness', conf: '97.2% confidence', risk: 'Stable' }
])

function runAILesionScan() {
  isScanningImaging.value = true
  setTimeout(() => {
    isScanningImaging.value = false
    mriLogs.value.unshift({
      label: 'AI Lesion Size Volumetric Change',
      conf: '99.1% confidence (Model 4.2)',
      risk: 'Moderate'
    })
  }, 1800)
}

function handleEhr(patient: any) {
  selectedPatient.value = patient
  isEhrOpen.value = true
}

watch(path, () => {
  searchQuery.value = ''
})

function triggerRefresh() {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}

const activeIcon = computed(() => {
  const p = path.value
  if (p === '/patients' || p === '/patient-analytics') return Users
  if (p === '/telemedicine') return VideoIcon
  if (p === '/medical-imaging') return FileHeart
  if (p === '/bed-management') return Hotel
  if (p === '/security-center') return Lock
  if (p.includes('pharmacy') || p.includes('inventory')) return Pill
  if (p.includes('billing') || p.includes('claims') || p.includes('financial')) return Landmark
  if (p.includes('settings')) return Settings
  if (p.includes('medical-records')) return FileText
  if (p.includes('admissions')) return DoorOpen
  if (p.includes('appointments')) return Calendar
  if (p.includes('ai-diagnosis')) return Stethoscope
  if (p.includes('lab-intelligence') || p.includes('lab-operations')) return ClipboardCheck
  if (p.includes('predictive-risk')) return ShieldAlert
  if (p.includes('clinical-decision')) return BrainCircuit
  if (p.includes('emergency')) return AlertTriangle
  if (p.includes('surgery')) return Scissors
  if (p.includes('staff')) return UserSquare
  if (p.includes('facility')) return ThermometerSun
  if (p.includes('asset')) return Compass
  if (p.includes('compliance')) return Landmark
  if (p.includes('messages')) return MessageSquareDashed
  if (p.includes('notifications')) return Bell
  if (p.includes('reports')) return FileSpreadsheet
  if (p.includes('api')) return Webhook
  return FileSpreadsheet
})

const pageMetas: Record<
  string,
  { title: string; description: string; statusText: string; badgeVariant: string }
> = {
  '/patients': {
    title: 'Patients Census',
    description: 'Patient demographic indices, triage metrics and case diagnostics.',
    statusText: 'CENSUS UP TO DATE',
    badgeVariant: 'success'
  },
  '/patient-analytics': {
    title: 'Patient Analytics Engine',
    description: 'Demographic LOS distributions and readmission coefficients.',
    statusText: 'ANALYTICS GENERATED',
    badgeVariant: 'purple'
  },
  '/medical-records': {
    title: 'Electronic Health Records',
    description: 'Permanent patient history files, diagnostics, and clinical encounters.',
    statusText: 'FHIR EHR SYNC OK',
    badgeVariant: 'success'
  },
  '/admissions-discharges': {
    title: 'Admissions & Discharges (ADT)',
    description:
      'ADT board tracking discharge clearances, surge capacities, and incoming ambulances.',
    statusText: 'SURGE ENVELOPE ACTIVE',
    badgeVariant: 'warning'
  },
  '/appointments': {
    title: 'Outpatient Appointments Planner',
    description: 'Consultation schedulers, doctor availability and cancellation forecasts.',
    statusText: 'SCHEDULER NOMINAL',
    badgeVariant: 'info'
  },
  '/telemedicine': {
    title: 'Telehealth Portal',
    description: 'Encrypted physician-patient consultation portals and AI diagnostics.',
    statusText: 'ON-AIR LINK ACTIVE',
    badgeVariant: 'danger'
  },
  '/ai-diagnosis': {
    title: 'Differential Diagnosis Assistant',
    description: 'AI differential diagnosis logs, clinical code matches, and protocol citations.',
    statusText: 'AI CONSULT ACTIVE',
    badgeVariant: 'purple'
  },
  '/medical-imaging': {
    title: 'Medical Imaging AI (DICOM)',
    description: 'Neural DICOM radiology scans and diagnostic anomaly detection.',
    statusText: 'RADIOLOGY MODEL ACTIVE',
    badgeVariant: 'purple'
  },
  '/lab-intelligence': {
    title: 'Lab Hematology Intelligence',
    description: 'Pathology specimen results, electrolytes and chemistry panel analytics.',
    statusText: 'LAB SENSORS NOMINAL',
    badgeVariant: 'success'
  },
  '/predictive-risk': {
    title: 'Predictive Risk Engine',
    description: 'Sepsis alert indices, cardiac arrest predictions, and readmission forecasts.',
    statusText: 'FORESIGHT ACTIVE',
    badgeVariant: 'purple'
  },
  '/clinical-decision': {
    title: 'Clinical Decision Support',
    description: 'Formulary interaction checks, allergen screening, and dosing protocols.',
    statusText: 'CDS BUNDLES OK',
    badgeVariant: 'success'
  },
  '/bed-management': {
    title: 'Live Ward Bed Occupancy',
    description: 'Interactive ward maps and bed turn-around metrics.',
    statusText: 'WARD HEATMAP OK',
    badgeVariant: 'success'
  },
  '/emergency-ops': {
    title: 'Emergency Triage (ESI)',
    description: 'Live triage intake pipelines, ESI queues, and ambulance coordination.',
    statusText: 'ED HEAVY WORKLOAD',
    badgeVariant: 'warning'
  },
  '/surgery-management': {
    title: 'Operating Room Suite Planner',
    description: 'OR schedules, surgeon allocations, and surgery telemetry.',
    statusText: '4 OR SUITES LIVE',
    badgeVariant: 'info'
  },
  '/staff-operations': {
    title: 'Staff Rotations & Stress Metrics',
    description: 'Nurse density indexes, physician rotations, and fatigue monitors.',
    statusText: 'STAFF ACTIVE',
    badgeVariant: 'warning'
  },
  '/facility-monitoring': {
    title: 'Smart Facility Telemetry',
    description: 'Air filtration HVAC, OR humidity levels, and energy statistics.',
    statusText: 'SENSORS 100% NOMINAL',
    badgeVariant: 'success'
  },
  '/asset-tracking': {
    title: 'Asset RFID Tracking',
    description: 'RFID locators tracking infusion pumps, crash carts, and ventilators.',
    statusText: 'ASSETS STREAM OK',
    badgeVariant: 'success'
  },
  '/pharmacy': {
    title: 'Pharmacy & Formulary',
    description: 'Medication dispensing, critical drug levels, and formulary reserves.',
    statusText: 'FORMULARY NOMINAL',
    badgeVariant: 'success'
  },
  '/inventory': {
    title: 'Inventory Reserves Control',
    description: 'PPE reserves, medical gases, and surgical supply tracking.',
    statusText: 'PPE LEVEL NOMINAL',
    badgeVariant: 'success'
  },
  '/lab-operations': {
    title: 'Laboratory Pathology Pipeline',
    description: 'Pathology specimen timelines and centrifuge calibration status.',
    statusText: 'LAB PIPELINE OK',
    badgeVariant: 'success'
  },
  '/billing': {
    title: 'Revenue Cycles & Payments',
    description: 'Patient invoices, payment allocations, and cost analytics.',
    statusText: 'BILLING RECONCILED',
    badgeVariant: 'success'
  },
  '/claims': {
    title: 'Insurance Claims & Audits',
    description: 'Denial analyses, claim submissions, and audit trail ledgers.',
    statusText: 'PRIOR-AUTH OK',
    badgeVariant: 'success'
  },
  '/financial-analytics': {
    title: 'Financial Analytics',
    description: 'Department margins, operational expenditures, and cost indicators.',
    statusText: 'FINANCIAL OK',
    badgeVariant: 'success'
  },
  '/security-center': {
    title: 'HIPAA Security Center',
    description: 'System file locks, gateway access logs, and terminal profiles.',
    statusText: 'HIPAA COMPLIANT',
    badgeVariant: 'success'
  },
  '/compliance': {
    title: 'Regulatory Compliance Audits',
    description: 'Audit logs, policy expirations, and accreditation checklists.',
    statusText: 'AUDIT GOLD RATING',
    badgeVariant: 'success'
  },
  '/messages': {
    title: 'Clinical Messages & Secure Chat',
    description: 'Encrypted clinical messaging for physicians and nurse practitioners.',
    statusText: 'MESSENGER ENCRYPTED',
    badgeVariant: 'success'
  },
  '/notifications': {
    title: 'Operations Notifications',
    description: 'Alert database history, severity filters, and event indexes.',
    statusText: 'ALERTS NOMINAL',
    badgeVariant: 'success'
  },
  '/reports': {
    title: 'Report Builder',
    description: 'Advanced analytics report generator and data exporter.',
    statusText: 'CSV BUILDER NOMINAL',
    badgeVariant: 'info'
  },
  '/api-integrations': {
    title: 'API Webhooks & HL7 Listeners',
    description: 'HL7 FHIR endpoints, API tokens, and webhook managers.',
    statusText: 'FHIR LISTENERS ACTIVE',
    badgeVariant: 'success'
  },
  '/settings': {
    title: 'Clinical OS Settings',
    description: 'Organization profiles, alert volumes, and system configuration.',
    statusText: 'SYSTEM NOMINAL',
    badgeVariant: 'success'
  }
}

const meta = computed(() => {
  return (
    pageMetas[path.value] || {
      title: 'Clinical Operations',
      description: 'Operational dashboard module.',
      statusText: 'NOMINAL',
      badgeVariant: 'default'
    }
  )
})

const filteredPatients = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const pats = hospitalStore.patients
  if (!query) return pats
  return pats.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.mrn.toLowerCase().includes(query) ||
      p.chiefComplaint.toLowerCase().includes(query)
  )
})

// === STATIC DATA MODELS FOR UNIQUE PAGE TEMPLATES ===

const appointmentSchedule = [
  {
    time: '08:00',
    patient: 'Sarah Jenkins',
    dept: 'Cardiology',
    doctor: 'Dr. Vance',
    type: 'Follow-Up',
    status: 'Completed'
  },
  {
    time: '09:00',
    patient: 'Thomas Shelby',
    dept: 'Surgery',
    doctor: 'Dr. Lin',
    type: 'Pre-Op Clearance',
    status: 'Completed'
  },
  {
    time: '10:30',
    patient: 'Mildred Pierce',
    dept: 'Orthopedics',
    doctor: 'Dr. Oh',
    type: 'Review',
    status: 'Completed'
  },
  {
    time: '11:15',
    patient: 'Elena Rostova',
    dept: 'General',
    doctor: 'Dr. Carter',
    type: 'Discharge Check',
    status: 'In Progress'
  },
  {
    time: '13:00',
    patient: 'Robert Miller',
    dept: 'Emergency',
    doctor: 'Dr. Carter',
    type: 'Triage Review',
    status: 'Scheduled'
  },
  {
    time: '14:30',
    patient: 'Sophia Wong',
    dept: 'Surgery',
    doctor: 'Dr. Lin',
    type: 'Consultation',
    status: 'Scheduled'
  }
]

const differentialDiagnoses = [
  {
    patient: 'Sarah Jenkins',
    conf: 94,
    assessment:
      'Acute STEMI with primary ischemia. ECG shows ST-elevation in leads V1-V4. Troponin T elevated.',
    icd: 'I21.0',
    recommendation: 'Cardiac catheterization recommended'
  },
  {
    patient: 'Robert Miller',
    conf: 88,
    assessment:
      'Suspected urosepsis with altered mental status. Temperature 39.1°C, WBC elevated at 18.2.',
    icd: 'A41.9',
    recommendation: 'Broad spectrum antibiotics stat'
  },
  {
    patient: 'Sophia Wong',
    conf: 79,
    assessment:
      'Suspected acute appendicitis. RLQ tenderness, McBurney point positive, elevated WBC.',
    icd: 'K35.80',
    recommendation: 'CT abdomen and surgical consult'
  }
]

const labResults = [
  {
    patient: 'Sarah Jenkins',
    test: 'Troponin T',
    result: '2.4 ng/mL',
    range: '0-0.04 ng/mL',
    flagged: true,
    status: 'Final'
  },
  {
    patient: 'Sarah Jenkins',
    test: 'Potassium K+',
    result: '3.2 mEq/L',
    range: '3.5-5.0 mEq/L',
    flagged: true,
    status: 'Final'
  },
  {
    patient: 'Robert Miller',
    test: 'Creatinine',
    result: '2.1 mg/dL',
    range: '0.7-1.3 mg/dL',
    flagged: true,
    status: 'Final'
  },
  {
    patient: 'Robert Miller',
    test: 'WBC Count',
    result: '18.2 K/uL',
    range: '4.5-11.0 K/uL',
    flagged: true,
    status: 'Final'
  },
  {
    patient: 'Sophia Wong',
    test: 'Leukocytes',
    result: '14.8 K/uL',
    range: '4.5-11.0 K/uL',
    flagged: false,
    status: 'Pending'
  },
  {
    patient: 'James Peterson',
    test: 'BNP',
    result: '340 pg/mL',
    range: '0-100 pg/mL',
    flagged: false,
    status: 'Final'
  }
]

const clinicalProtocols = [
  {
    name: 'Sepsis Bundle (SEP-1)',
    desc: 'qSOFA screening, lactate measurement, blood cultures within 1hr',
    active: true
  },
  {
    name: 'STEMI Protocol',
    desc: 'Door-to-balloon < 90 mins, aspirin, heparin, dual antiplatelet',
    active: true
  },
  {
    name: 'Stroke Code (NIHSS)',
    desc: 'tPA within 4.5 hrs, CT head, neurology consult',
    active: false
  },
  {
    name: 'Massive Transfusion',
    desc: '1:1:1 ratio PRBC:FFP:Platelets, type & crossmatch',
    active: false
  }
]

const staffRoster = [
  {
    name: 'Dr. Evelyn Carter',
    role: 'Attending Physician',
    dept: 'Emergency',
    shift: '07:00-19:00',
    hours: 11.5,
    fatigue: 72,
    status: 'Active'
  },
  {
    name: 'Dr. Marcus Vance',
    role: 'Cardiologist',
    dept: 'ICU',
    shift: '06:00-18:00',
    hours: 13,
    fatigue: 82,
    status: 'Active'
  },
  {
    name: 'Dr. David Lin',
    role: 'Surgeon',
    dept: 'OR',
    shift: '08:00-20:00',
    hours: 10,
    fatigue: 55,
    status: 'Active'
  },
  {
    name: 'RN Sarah Gamp',
    role: 'ICU Nurse',
    dept: 'ICU Ward A',
    shift: '07:00-19:00',
    hours: 12.5,
    fatigue: 88,
    status: 'Active'
  },
  {
    name: 'RN James Dickens',
    role: 'ED Nurse',
    dept: 'Emergency',
    shift: '19:00-07:00',
    hours: 6,
    fatigue: 34,
    status: 'Active'
  },
  {
    name: 'Dr. Clara Thorne',
    role: 'Anesthesiologist',
    dept: 'OR',
    shift: '07:00-15:00',
    hours: 7,
    fatigue: 42,
    status: 'Active'
  }
]

const facilitySensors = [
  { zone: 'OR Suite 1', temp: '68.2°F', humidity: '44%', airExchange: 22, status: 'Nominal' },
  { zone: 'OR Suite 2', temp: '67.8°F', humidity: '46%', airExchange: 21, status: 'Nominal' },
  { zone: 'OR Suite 3', temp: '69.1°F', humidity: '48%', airExchange: 20, status: 'Nominal' },
  { zone: 'ICU Ward A', temp: '68.4°F', humidity: '45%', airExchange: 18, status: 'Nominal' },
  { zone: 'Emergency Dept', temp: '70.2°F', humidity: '42%', airExchange: 15, status: 'Nominal' },
  { zone: 'Pharmacy Storage', temp: '65.0°F', humidity: '35%', airExchange: 12, status: 'Nominal' }
]

const assetList = [
  {
    id: 'V-441',
    name: 'Ventilator V-441',
    location: 'ICU Room 104',
    battery: 92,
    calibrated: '2 days ago'
  },
  {
    id: 'P-991',
    name: 'Infusion Pump P-991',
    location: 'ICU Room 104',
    battery: 82,
    calibrated: '1 day ago'
  },
  {
    id: 'D-001',
    name: 'Defibrillator D-001',
    location: 'Crash Cart ED-2',
    battery: 98,
    calibrated: '2 days ago'
  },
  {
    id: 'M-112',
    name: 'Patient Monitor M-112',
    location: 'ICU Room 102',
    battery: 76,
    calibrated: '3 days ago'
  },
  {
    id: 'P-442',
    name: 'Infusion Pump P-442',
    location: 'ED Room 03',
    battery: 15,
    calibrated: '5 days ago'
  },
  {
    id: 'V-223',
    name: 'Ventilator V-223',
    location: 'Storage Bay C',
    battery: 100,
    calibrated: 'Today'
  }
]

const pharmacyInventory = [
  {
    name: 'Epinephrine 1mg/mL',
    desc: 'Critical emergency vials. Threshold: 50 vials.',
    stock: '140 vials',
    pct: 93,
    critical: false
  },
  {
    name: 'Insulin Glargine 100 U/mL',
    desc: 'Critical low! Refill order auto-triggered.',
    stock: '12 pens',
    pct: 12,
    critical: true
  },
  {
    name: 'Heparin Sodium 5,000 U/mL',
    desc: 'Anticoagulant reserves. Threshold: 30 vials.',
    stock: '85 vials',
    pct: 71,
    critical: false
  },
  {
    name: 'Piperacillin-Tazobactam',
    desc: 'Broad-spectrum antibiotic for sepsis protocol.',
    stock: '62 vials',
    pct: 52,
    critical: false
  },
  {
    name: 'Morphine Sulfate 10mg/mL',
    desc: 'Controlled narcotic. DEA schedule II.',
    stock: '40 ampules',
    pct: 67,
    critical: false
  }
]

const inventoryItems = [
  { name: 'N95 Surgical Masks', pct: 90, desc: '450 boxes available. Monthly burn: 200 boxes.' },
  { name: 'Medical Oxygen O₂', pct: 84, desc: 'Cryogenic reserves at 84% capacity. Flow nominal.' },
  { name: 'Sterile Surgical Drapes', pct: 80, desc: '120 kits available. Min threshold: 50 kits.' },
  { name: 'Nitrile Exam Gloves', pct: 72, desc: '380 boxes available. Monthly burn: 300 boxes.' },
  { name: 'IV Fluid Bags (NS)', pct: 95, desc: '220 bags available. Auto-reorder at 50 bags.' },
  {
    name: 'Blood Bank Units',
    pct: 68,
    desc: '34 units available. Cross-match active for 3 patients.'
  }
]

const invoices = [
  {
    patient: 'Sarah Jenkins',
    service: 'STEMI Cardiac Care',
    amount: '$48,250',
    insurance: 'BlueCross',
    status: 'PENDING'
  },
  {
    patient: 'Elena Rostova',
    service: 'Cholecystectomy',
    amount: '$14,800',
    insurance: 'United',
    status: 'CLEARED'
  },
  {
    patient: 'Thomas Shelby',
    service: 'Lap. Appendectomy',
    amount: '$12,400',
    insurance: 'Aetna',
    status: 'CLEARED'
  },
  {
    patient: 'Robert Miller',
    service: 'ED Sepsis Workup',
    amount: '$8,900',
    insurance: 'Medicare',
    status: 'PENDING'
  }
]

const claimsList = [
  {
    id: 'BCBS-9941',
    patient: 'Sarah Jenkins',
    desc: 'Prior-Auth approved for STEMI emergency angioplasty.',
    status: 'APPROVED'
  },
  {
    id: 'MCA-4418',
    patient: 'Pendelton',
    desc: 'Denial flagged: Missing anesthesia documentation.',
    status: 'DENIED'
  },
  {
    id: 'UNH-8831',
    patient: 'Peterson',
    desc: 'Appeal triggered for extended ICU ventilator staging.',
    status: 'APPEALED'
  },
  {
    id: 'AET-2201',
    patient: 'Shelby',
    desc: 'Pre-operative surgical clearance approved.',
    status: 'APPROVED'
  }
]

const deptMargins = [
  { name: 'Cardiology', margin: 24.8, desc: 'Expenditure within target constraints' },
  { name: 'Emergency Department', margin: -4.2, desc: 'Elevated ESI-1 trauma staffing overhead' },
  { name: 'Outpatient Surgery', margin: 18.5, desc: 'Utilization optimization nominal' },
  { name: 'Orthopedics', margin: 22.1, desc: 'High elective procedure volume' },
  { name: 'Radiology', margin: 15.3, desc: 'AI diagnostic model reducing re-scans' }
]

const complianceItems = [
  {
    name: 'Joint Commission Accreditation',
    desc: 'Clinical operations checklists verified. Gold rating.',
    passed: true
  },
  {
    name: 'OR Sanitization Certificate',
    desc: 'Surgical clean suites certificate valid.',
    passed: true
  },
  {
    name: 'DEA Schedule Audit',
    desc: 'Controlled narcotic logs matched inventories.',
    passed: true
  },
  { name: 'Fire Safety Inspection', desc: 'Annual fire drill and equipment check.', passed: true },
  { name: 'HIPAA Training Renewal', desc: 'Staff certification due in 60 days.', passed: false },
  {
    name: 'Biomedical Equipment Cert',
    desc: 'Annual calibration certification due in 45 days.',
    passed: false
  }
]

const messageThreads = [
  {
    from: 'Dr. Marcus Vance',
    preview: 'V-Tach episode on Jenkins stabilized with Amiodarone. Please review labs.',
    time: '10m ago',
    self: false
  },
  {
    from: 'RN Sarah Gamp',
    preview: 'Sepsis alert active for Bed A4. Stat lactate panel ordered.',
    time: '14m ago',
    self: false
  },
  {
    from: 'Dr. Evelyn Carter',
    preview: 'Rerouting incoming respiratory ambulances to trauma room 3.',
    time: '25m ago',
    self: true
  },
  {
    from: 'Dr. David Lin',
    preview: 'OR Suite 2 prepped for Shelby appendectomy at 14:30.',
    time: '32m ago',
    self: false
  }
]

const reportTypes = [
  {
    name: 'Patient Census Report',
    desc: 'Demographic breakdown and LOS distributions',
    last: '2 hours ago'
  },
  {
    name: 'Financial Summary',
    desc: 'Revenue cycle and department margin analytics',
    last: 'Yesterday'
  },
  {
    name: 'Quality Metrics (CMS)',
    desc: 'Core measures, readmission rates, and HCAHPS',
    last: '3 days ago'
  },
  {
    name: 'Infection Control Report',
    desc: 'HAI rates, CLABSI/CAUTI tracking, and trends',
    last: '1 week ago'
  },
  {
    name: 'Staff Utilization Report',
    desc: 'FTE analysis, overtime trends, and burnout indices',
    last: '2 days ago'
  },
  {
    name: 'FHIR Data Export',
    desc: 'Full HL7 FHIR R4 bundle export for all active patients',
    last: 'Today'
  }
]

const apiEndpoints = [
  {
    name: 'FHIR Patient Intake',
    desc: 'HL7 gateway on TCP/IP port 5678',
    endpoint: ':5678/fhir/r4',
    status: 'Connected'
  },
  {
    name: 'DICOM Radiology Hook',
    desc: 'Radiology PACS server webhook',
    endpoint: ':8042/dicom',
    status: 'Connected'
  },
  {
    name: 'Aether AI Consult API',
    desc: 'Secure diagnostics consultation',
    endpoint: ':443/api/v3/ai',
    status: 'Connected'
  },
  {
    name: 'Lab Results Listener',
    desc: 'Pathology LIS integration',
    endpoint: ':5680/lis/results',
    status: 'Connected'
  },
  {
    name: 'Pharmacy Formulary Sync',
    desc: 'Drug database auto-update',
    endpoint: ':5681/rx/sync',
    status: 'Idle'
  },
  {
    name: 'Insurance Claims Gateway',
    desc: 'EDI 837/835 transaction pipe',
    endpoint: ':5682/edi',
    status: 'Connected'
  }
]
</script>

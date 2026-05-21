<template>
  <div class="flex flex-col gap-6 select-none">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-med-text tracking-tight flex items-center gap-2">
          Clinical AI Intelligence Hub
        </h2>
        <p class="text-xs text-med-text-muted mt-1">
          Operational foresight engine processing clinic queues, lab panels, and security telemetry.
        </p>
      </div>
      <div>
        <Badge variant="purple" :dot="true" :pulse="true">AETHER-AI MODEL 4.2 ONLINE</Badge>
      </div>
    </div>

    <!-- Tier 1: Neural predictions and charts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Neural Hospital Congestion Forecast -->
      <Card
        title="Admissions & Congestion Forecast"
        subtitle="Predictive 24-hour ER surge model"
        class="lg:col-span-2"
        :hover-glow-ai="true"
      >
        <template #title-icon><activity-square class="w-4 h-4 text-med-purple" /></template>

        <!-- Beautiful custom SVG line chart displaying predicted vs actual surge -->
        <div
          class="relative w-full h-[180px] bg-neutral-950/40 rounded-xl border border-med-border/50 p-4 mt-2 overflow-hidden flex flex-col justify-between"
        >
          <svg
            class="absolute inset-0 w-full h-full"
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
          >
            <!-- Grid lines -->
            <line
              x1="0"
              y1="30"
              x2="400"
              y2="30"
              stroke="#253046"
              stroke-width="0.5"
              stroke-dasharray="2,2"
            />
            <line
              x1="0"
              y1="60"
              x2="400"
              y2="60"
              stroke="#253046"
              stroke-width="0.5"
              stroke-dasharray="2,2"
            />
            <line
              x1="0"
              y1="90"
              x2="400"
              y2="90"
              stroke="#253046"
              stroke-width="0.5"
              stroke-dasharray="2,2"
            />

            <!-- Area under path -->
            <path
              d="M 0 120 L 0 60 Q 50 30, 100 80 T 200 40 T 300 90 T 400 20 L 400 120 Z"
              fill="#8B5CF6"
              opacity="0.06"
            />

            <!-- Actual line -->
            <path
              d="M 0 60 Q 50 30, 100 80 T 200 40 T 300 90 T 400 20"
              fill="none"
              stroke="#8B5CF6"
              stroke-width="2.5"
              stroke-linecap="round"
            />

            <!-- Predicted dotted line -->
            <path
              d="M 0 65 Q 50 35, 100 85 T 200 45 T 300 95 T 400 25"
              fill="none"
              stroke="#06B6D4"
              stroke-width="1.5"
              stroke-dasharray="4,4"
              stroke-linecap="round"
            />
          </svg>

          <!-- Timeline ticks -->
          <div
            class="flex items-center justify-between font-mono text-[9px] text-med-text-muted mt-auto z-10 select-none"
          >
            <span>22:00 (Actual)</span>
            <span>02:00</span>
            <span>06:00</span>
            <span>10:00</span>
            <span>14:00 (Predict)</span>
          </div>
        </div>

        <div
          class="flex flex-wrap items-center justify-between gap-4 text-xxs text-med-text-muted mt-4"
        >
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5"
              ><span class="w-2.5 h-1 bg-med-purple rounded"></span> Actual Admissions</span
            >
            <span class="flex items-center gap-1.5"
              ><span class="w-2.5 h-1 border-b border-dashed border-med-primary"></span> AI Model
              Forecast</span
            >
          </div>
          <span class="text-med-teal font-semibold font-mono"
            >Prediction Error Margin: ±4.2% (Optimal)</span
          >
        </div>
      </Card>

      <!-- Diagnosis Confidence & Severity Scales -->
      <Card
        title="AI Diagnostics Distribution"
        subtitle="Active neural decision tree cases"
        :hover-glow-ai="true"
      >
        <template #title-icon><brain-circuit class="w-4 h-4 text-med-purple" /></template>
        <div class="flex flex-col gap-4 mt-2 select-none text-left">
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between text-xxs">
              <span class="font-bold text-med-text">Cardiology / Ischemia Detection</span>
              <span class="font-mono text-med-purple font-bold">94.8% Conf</span>
            </div>
            <div
              class="w-full bg-neutral-950/40 rounded-full h-1.5 border border-med-border/40 overflow-hidden"
            >
              <div class="bg-med-purple h-full rounded-full" style="width: 94.8%"></div>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between text-xxs">
              <span class="font-bold text-med-text">Pulmonology / COPD Anomaly</span>
              <span class="font-mono text-med-primary font-bold">89.2% Conf</span>
            </div>
            <div
              class="w-full bg-neutral-950/40 rounded-full h-1.5 border border-med-border/40 overflow-hidden"
            >
              <div class="bg-med-primary h-full rounded-full" style="width: 89.2%"></div>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between text-xxs">
              <span class="font-bold text-med-text">Pathology / Sepsis Risk score</span>
              <span class="font-mono text-med-teal font-bold">87.5% Conf</span>
            </div>
            <div
              class="w-full bg-neutral-950/40 rounded-full h-1.5 border border-med-border/40 overflow-hidden"
            >
              <div class="bg-med-teal h-full rounded-full" style="width: 87.5%"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Tier 2: AI Generated Insight Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card
        title="Congestion Forecasting"
        subtitle="Predictive emergency arrival rates"
        :hover-glow-ai="true"
      >
        <template #title-icon><users class="w-4 h-4 text-med-purple" /></template>
        <p class="text-xxs text-med-text-muted leading-relaxed text-left">
          Correlation logic suggests rain conditions in local municipality will increase respiratory
          admissions by 12.4% over next 4 hours. Recommend adjusting ICU shift rotations.
        </p>
      </Card>

      <Card
        title="Staff Burnout Analysis"
        subtitle="Predictive work pressure rating"
        :hover-glow-ai="true"
      >
        <template #title-icon><users class="w-4 h-4 text-med-purple" /></template>
        <p class="text-xxs text-med-text-muted leading-relaxed text-left">
          Nursing shifts in the ED average 12.5 hours with a 1:5 patient density ratio. Model flags
          high fatigue warning for Nurse Dickens, raising potential error rate risk.
        </p>
      </Card>

      <Card
        title="Drug stock predictive reserves"
        subtitle="Automated inventory triggers"
        :hover-glow-ai="true"
      >
        <template #title-icon><users class="w-4 h-4 text-med-purple" /></template>
        <p class="text-xxs text-med-text-muted leading-relaxed text-left">
          formulary reserve model flags Insulin Glargine supply decline (12 pens left, min threshold
          20). Auto-purchase webhook triggered to distributor. Refill ETA: 12 hours.
        </p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import { BrainCircuit, ActivitySquare, Users } from 'lucide-vue-next'
</script>

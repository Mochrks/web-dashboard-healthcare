<template>
  <div class="flex flex-col h-full bg-med-card">
    <!-- Quick recommendations header -->
    <div class="mb-4">
      <h3 class="text-xxs font-bold uppercase tracking-wider text-med-text-muted mb-2.5">
        Contextual AI Suggestions
      </h3>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="sug in quickSuggestions"
          :key="sug.prompt"
          type="button"
          class="text-xxs px-2.5 py-1.5 rounded-lg bg-med-card-sec border border-med-border hover:border-med-purple/40 text-med-text-muted hover:text-med-text hover:shadow-ai-glow transition-all duration-300 text-left"
          @click="sendQuickPrompt(sug.prompt)"
        >
          {{ sug.label }}
        </button>
      </div>
    </div>

    <!-- Messages Chat History -->
    <div
      class="flex-1 min-h-[300px] border border-med-border rounded-2xl bg-neutral-950/20 p-4 overflow-y-auto flex flex-col gap-4 mb-4 scrollbar-thin"
    >
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="[
          'flex flex-col gap-1 p-3.5 rounded-xl border max-w-[85%] text-xs leading-relaxed transition-all duration-300',
          msg.isAi
            ? 'bg-med-card border-med-purple/20 text-med-text mr-auto shadow-ai-glow/5'
            : 'bg-med-primary/10 border-med-primary/20 text-med-primary ml-auto'
        ]"
      >
        <div class="flex items-center gap-1.5 mb-1 select-none">
          <span
            :class="[
              'font-semibold text-[10px] tracking-wider uppercase',
              msg.isAi ? 'text-med-purple' : 'text-med-primary'
            ]"
          >
            {{ msg.sender }}
          </span>
          <span class="text-[9px] text-med-text-muted">• {{ msg.timestamp }}</span>
        </div>
        <div class="font-sans whitespace-pre-line">{{ msg.text }}</div>
      </div>

      <!-- Typing Indicator -->
      <div
        v-if="isTyping"
        class="bg-med-card border border-med-purple/10 text-med-text mr-auto p-3.5 rounded-xl flex items-center gap-2 max-w-[80%] text-xs"
      >
        <span class="text-[10px] font-semibold tracking-wider text-med-purple uppercase select-none"
          >AI ENGINE</span
        >
        <div class="flex items-center gap-1">
          <span
            class="w-1.5 h-1.5 bg-med-purple rounded-full animate-bounce"
            style="animation-delay: 0ms"
          ></span>
          <span
            class="w-1.5 h-1.5 bg-med-purple rounded-full animate-bounce"
            style="animation-delay: 150ms"
          ></span>
          <span
            class="w-1.5 h-1.5 bg-med-purple rounded-full animate-bounce"
            style="animation-delay: 300ms"
          ></span>
        </div>
      </div>
    </div>

    <!-- User Chat Input Form -->
    <form @submit.prevent="handleSubmit" class="flex gap-2 relative items-center">
      <input
        v-model="inputValue"
        type="text"
        placeholder="Ask the Clinical AI (e.g. 'check sepsis score')..."
        class="flex-1 bg-med-card-sec border border-med-border focus:border-med-purple rounded-xl py-3 px-4 text-xs text-med-text placeholder-med-text-muted outline-none transition-colors pr-10"
        :disabled="isTyping"
      />
      <button
        type="submit"
        class="absolute right-2 text-med-purple hover:text-med-purple/80 p-1.5 hover:bg-med-card rounded-lg transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!inputValue.trim() || isTyping"
      >
        <send class="w-4 h-4" />
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '../../stores/chatStore'
import { Send } from 'lucide-vue-next'

const chatStore = useChatStore()
const messages = computed(() => chatStore.messages)
const isTyping = computed(() => chatStore.isTyping)

const inputValue = ref('')

const quickSuggestions = [
  { label: '⚡ ICU Sepsis Protocol', prompt: 'Check ICU Patient Sepsis Risk' },
  { label: '🛏️ ED Surge & Beds', prompt: 'ED Surge & Bed Capacity' },
  { label: '❤️ Sarah V-Tach Alert', prompt: 'Sarah Jenkins Arrhythmia Alert' },
  { label: '🛡️ Unauthorized IP Access', prompt: 'HIPAA Breach Security Logs' },
  { label: '✂️ Stage Appendectomy OR', prompt: 'Stage Sophia Wong Appendectomy' }
]

function handleSubmit() {
  if (!inputValue.value.trim() || isTyping.value) return
  chatStore.sendMessage(inputValue.value)
  inputValue.value = ''
}

function sendQuickPrompt(promptText: string) {
  if (isTyping.value) return
  chatStore.sendMessage(promptText)
}
</script>

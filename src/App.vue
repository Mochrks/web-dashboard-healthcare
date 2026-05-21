<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'dark'
  document.documentElement.className = savedTheme
})
</script>

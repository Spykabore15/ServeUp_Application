<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from './store/settings'

const settingsStore = useSettingsStore()
const isDarkMode = computed(() => settingsStore.darkMode)
</script>

<style>
/* Global styles will be imported from main.css */
</style>


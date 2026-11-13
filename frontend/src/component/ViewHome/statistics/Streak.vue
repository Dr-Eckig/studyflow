<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'
import { StoreStatistics } from '@/store/StoreStatistics'
import { computed, onMounted } from 'vue'

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

const statisticsStore = StoreStatistics()

onMounted(async () => {
  await statisticsStore.fetchStreakStatistics()
})

const streakDays = computed(() => statisticsStore.streakStats.currentStreak)
</script>

<template>
  <div class="sheet streak-card statistics-card">
    <div class="card-content">
      <div class="statistics-container">
        <div class="streak-number">{{ streakDays ?? 0 }}</div>
        <v-icon icon="mdi-fire" color="error" size="56" />
      </div>
      <p class="center streak-title card-title">{{ translate('statistics_streak') }}</p>
    </div>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewHome/statistics/Streak.css';
</style>

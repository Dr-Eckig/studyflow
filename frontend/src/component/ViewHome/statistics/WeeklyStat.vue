<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'
import { StoreStatistics } from '@/store/StoreStatistics'
import { computed, onMounted } from 'vue'

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

const statisticsStore = StoreStatistics()

onMounted(async () => {
  await statisticsStore.fetchWeeklyStatistics()
})

const weeklyStats = computed(() => statisticsStore.weeklyStats)

/** Calculates the weekly completion percentage */
const weeklyCompletion = computed(() => {
  const stats = weeklyStats.value
  const completed = Number(stats.weeklyTasksCompleted)
  const total = Number(stats.weeklyTasks)

  if (isNaN(completed) || isNaN(total) || total === 0) {
    return 0
  }

  if (total === 0) return 0
  return Math.round((completed / total) * 100)
})
</script>

<template>
  <div class="sheet progress-card statistics-card">
    <div class="card-content">
      <div class="statistics-container">
        <v-progress-circular
          :model-value="weeklyCompletion"
          :rotate="360"
          :size="120"
          :width="12"
          color="primary"
          class="progress-circle"
          :aria-label="translate('statistics_weekly') + ' ' + weeklyCompletion + '%'"
        >
          <span class="progress-text">{{ weeklyCompletion }}%</span>
        </v-progress-circular>
      </div>
      <p class="center progress-title card-title">{{ translate('statistics_weekly') }}</p>
    </div>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewHome/statistics/WeeklyStat.css';
</style>

<script setup lang="ts">
import Chip from '@/component/Chip.vue'
import { StoreI18n } from '@/store/StoreI18n'
import { StoreStatistics } from '@/store/StoreStatistics'
import { formatDate } from '@/util/date'
import { pluralizeDay } from '@/util/grammar'
import { computed, onMounted } from 'vue'

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

const statisticsStore = StoreStatistics()

onMounted(async () => {
  await statisticsStore.fetchExamStatistics()
})

const examStats = computed(() => statisticsStore.examStats)
</script>

<template>
  <div class="sheet exam-card statistics-card">
    <div class="card-content">
      <div class="exam-container">
        <div class="exam-subject">
          {{ examStats.examTitle || translate('statistics_no_exam') }}
        </div>
        <div class="exam-date">
          {{ examStats.examDate && formatDate(new Date(examStats.examDate)) }}
        </div>
        <Chip
          v-if="examStats.daysRemaining"
          :label="`${examStats.daysRemaining ?? 0} ${pluralizeDay(examStats.daysRemaining ?? 0)}`"
          color="success"
          rounded
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewHome/statistics/NextDeadline.css';
</style>

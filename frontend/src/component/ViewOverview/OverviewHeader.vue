<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'
import type { VuetifyColor } from '@/type'
import type { Deadline } from '@/type/model/deadline'
import ProgressBar from '../ProgressBar.vue'
import Chip from '../Chip.vue'
import { pluralizeDay } from '@/util/grammar'

const { deadline } = defineProps<{ deadline: Deadline }>()

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

/**
 * Calculates the status of a deadline based on the difference between the deadline's due date and today
 * @param {Date} dueDate - The due date of the deadline
 * @returns {{status: string, color: VuetifyColor}} - An object containing the status (a string describing the deadline's status) and the Vuetify color associated with that status
 */
const getDeadlineStatus = (dueDate: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { status: translate('overview_overdue'), color: 'error' as VuetifyColor }
  if (diffDays <= 7)
    return { status: `${diffDays} ${pluralizeDay(diffDays)}`, color: 'warning' as VuetifyColor }
  return { status: `${diffDays} ${pluralizeDay(diffDays)}`, color: 'primary' as VuetifyColor }
}
</script>

<template>
  <header>
    <div class="sheet-chip">
      <Chip
        :label="getDeadlineStatus(deadline.dueDate).status"
        size="small"
        :color="getDeadlineStatus(deadline.dueDate).color"
      />
    </div>
    <h2 class="sheet-title">
      {{ deadline.title }}
    </h2>

    <p class="sheet-subtitle">
      {{ deadline.description }}
    </p>
    <ProgressBar
      :percentage="deadline.donePercent ? deadline.donePercent : 0"
      :text="
        `${deadline.donePercent ? deadline.donePercent : 0}` +
        '% ' +
        translate('tasks_today_progress')
      "
    />
  </header>
</template>

<style scoped>
@import '@/css/component/ViewOverview/OverviewHeader.css';
</style>

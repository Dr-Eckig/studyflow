<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'
import type { Deadline } from '@/type/model/deadline'

const { deadline } = defineProps<{ deadline: Deadline }>()

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>

<template>
  <div v-if="deadline.completedTaskNames && deadline.completedTaskNames.length > 0">
    <p class="task-title text-green">
      <v-icon icon="mdi-check-circle-outline" />
      <span> {{ translate('overview_task_done') }} ({{ deadline.completedTaskNames.length }})</span>
    </p>
    <div v-for="task in deadline.completedTaskNames" :key="task">
      <v-icon icon="mdi-circle-medium" />
      <span>
        {{ task }}
      </span>
    </div>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewOverview/DoneTasks.css';
</style>

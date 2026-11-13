<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'
import type { Deadline } from '@/type/model/deadline'

const { deadline } = defineProps<{ deadline: Deadline }>()
const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>

<template>
  <div v-if="deadline.openTaskNames && deadline.openTaskNames.length > 0">
    <p class="task-title text-red">
      <v-icon icon="mdi-clock-outline" />
      <span> {{ translate('overview_task_open') }} ({{ deadline.openTaskNames.length }})</span>
    </p>
    <div v-for="task in deadline.openTaskNames" :key="task">
      <v-icon icon="mdi-circle-medium" />
      <span>
        {{ task }}
      </span>
    </div>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewOverview/OpenTasks.css';
</style>

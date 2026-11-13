<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'
import type { Deadline } from '@/type/model/deadline'

const { deadline } = defineProps<{ deadline: Deadline }>()

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>

<template>
  <div
    v-if="deadline.openTaskNames.length === 0 && deadline.completedTaskNames.length === 0"
    class="no-tasks-text"
  >
    <v-icon icon="mdi-clipboard-list-outline" />
    <span>{{ translate('overview_task_none') }}</span>
  </div>
</template>

<style scoped>
@import '@/css/component/ViewOverview/NoTasks.css';
</style>

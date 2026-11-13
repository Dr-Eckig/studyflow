<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'

withDefaults(
  defineProps<{
    centered?: boolean
    showCalendarLink?: boolean
    titleKey?: string
  }>(),
  {
    centered: false,
    showCalendarLink: false,
    titleKey: 'first_deadline_title',
  },
)

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>

<template>
  <section class="first-deadline-hint" :class="{ 'first-deadline-hint--centered': centered }">
    <v-icon icon="mdi-calendar-plus" :size="centered ? 56 : 32" aria-hidden="true" />
    <div class="hint-content">
      <h2 class="hint-title">{{ translate(titleKey) }}</h2>
      <p>{{ translate('first_deadline_description') }}</p>
      <p v-if="!showCalendarLink" class="calendar-instruction">
        {{ translate('calendar_add_deadline') }}
      </p>
    </div>
    <v-btn
      v-if="showCalendarLink"
      :to="{ name: 'home' }"
      color="primary"
      prepend-icon="mdi-calendar-plus"
    >
      {{ translate('go_to_calendar') }}
    </v-btn>
  </section>
</template>

<style scoped>
@import '@/css/component/FirstDeadlineHint.css';
</style>

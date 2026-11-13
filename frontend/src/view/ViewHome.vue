<script setup lang="ts">
import Calendar from '@/component/ViewHome/calendar/Calendar.vue'
import TodaysTasks from '@/component/ViewHome/TodaysTasks.vue'
import WeeklyStat from '@/component/ViewHome/statistics/WeeklyStat.vue'
import Streak from '@/component/ViewHome/statistics/Streak.vue'
import NextDeadline from '@/component/ViewHome/statistics/NextDeadline.vue'
import Motivation from '@/component/ViewHome/statistics/Motivation.vue'
</script>

<template>
  <main class="dashboard">
    <section class="dashboard-top">
      <Calendar />

      <section class="todays-tasks">
        <TodaysTasks />
      </section>
    </section>
    <section class="dashboard-bottom">
      <WeeklyStat />
      <Streak />
      <NextDeadline />
      <Motivation />
    </section>
  </main>
</template>

<style scoped>
@import '@/css/view/ViewHome.css';
</style>

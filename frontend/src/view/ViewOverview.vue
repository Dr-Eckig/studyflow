<script setup lang="ts">
import Loading from '@/component/Loading.vue'
import FirstDeadlineHint from '@/component/FirstDeadlineHint.vue'
import DoneTasks from '@/component/ViewOverview/DoneTasks.vue'
import NoTasks from '@/component/ViewOverview/NoTasks.vue'
import OpenTasks from '@/component/ViewOverview/OpenTasks.vue'
import OverviewHeader from '@/component/ViewOverview/OverviewHeader.vue'
import { StoreTasks } from '@/store/StoreTasks'
import { onMounted, ref } from 'vue'

const storeTask = StoreTasks()

const loading = ref(true)

// Load overview from store
onMounted(async () => {
  await storeTask.fetchOverview()
  loading.value = false
})
</script>

<template>
  <Loading v-if="loading" />
  <main
    class="learning-overview"
    :class="{ 'learning-overview--empty': storeTask.overview.length === 0 }"
    v-else
  >
    <div class="overview-container">
      <div v-if="storeTask.overview.length === 0" class="empty-overview">
        <FirstDeadlineHint centered show-calendar-link title-key="overview_exams_none" />
      </div>
      <div class="row" v-else>
        <div class="col" v-for="deadline in storeTask.overview" :key="deadline.title">
          <section class="sheet">
            <OverviewHeader :deadline="deadline" />

            <div class="all-tasks">
              <OpenTasks :deadline="deadline" />

              <DoneTasks :deadline="deadline" />

              <NoTasks :deadline="deadline" />
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import '../css/view/ViewOverview.css';
</style>

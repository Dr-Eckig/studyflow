<script setup lang="ts">
import { RouterView } from 'vue-router'
import Loading from './component/Loading.vue'
import Button from './component/Button.vue'
import Sidebar from './component/Sidebar.vue'
import Toolbar from './component/Toolbar.vue'
import BottomNavigation from './component/BottomNavigation.vue'
import { StoreInitialize } from './store/StoreInitialize'
import { StoreI18n } from './store/StoreI18n'
import { StoreSession } from './store/StoreSession'
import { computed, ref } from 'vue'

const initializer = StoreInitialize()

StoreI18n()
const initializationError = ref(false)
const initialize = async () => {
  initializationError.value = false
  try {
    await initializer.initialize()
  } catch (error) {
    initializationError.value = true
    console.error('Error initializing application:', error)
  }
}
initialize()
const sessionStore = StoreSession()
const isLoggedIn = computed(() => {
  return sessionStore.isLoggedIn
})
</script>

<template>
  <v-app>
    <div v-if="initializationError" role="alert" class="initialization-error center">
      <p>Die Anwendung konnte nicht geladen werden. Bitte versuche es erneut.</p>
      <Button label="Erneut versuchen" color="primary" @click="initialize" />
    </div>
    <Loading v-else-if="!initializer.isInitialized" />

    <div class="app-container" v-else>
      <!-- Sidebar for larger Devices -->
      <Sidebar class="is-hidden-tablet-and-mobile" v-if="isLoggedIn" />
      <div class="main-content">
        <Toolbar />
        <RouterView />
      </div>
      <!-- Bottom Navigation for smaller Devices -->
      <BottomNavigation class="is-hidden-desktop" />
    </div>
  </v-app>
</template>

<style>
@import 'css/body.css';

.initialization-error {
  min-height: 100dvh;
  width: 100%;
  gap: 1rem;
  padding: 1rem;
}
</style>

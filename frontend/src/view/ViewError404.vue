<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'
import { StoreSession } from '@/store/StoreSession'
import { onMounted, ref } from 'vue'

const sessionStore = StoreSession()

const isLoggedOut = ref(false)

onMounted(async () => {
  isLoggedOut.value = !sessionStore.isLoggedIn
})

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>

<template>
  <main class="error-container center" :class="{ 'error-container-margin': isLoggedOut }">
    <div class="sheet">
      <h1 class="error-code">404</h1>
      <h2 class="error-message">{{ translate('error-message') }}</h2>
      <p class="error-description">{{ translate('error-description') }}</p>
    </div>
  </main>
</template>

<style scoped>
@import '@/css/view/ViewError404.css';
</style>

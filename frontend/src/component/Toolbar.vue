<script setup lang="ts">
import Button from '@/component/Button.vue'
import Logo from '@/../public/assets/Logo.vue'
import { StoreI18n } from '@/store/StoreI18n'
import { StoreSession } from '@/store/StoreSession'
import Germany from '../../public/assets/Germany.vue'
import GreatBritain from '../../public/assets/GreatBritain.vue'
import { StoreUser } from '@/store/StoreUser'
import { router } from '@/router'
import ButtonThemeSwitch from './ButtonThemeSwitch.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const storeUser = StoreUser()
const sessionStore = StoreSession()
const isLoggedIn = computed(() => sessionStore.isLoggedIn)

const storeI18n = StoreI18n()

/** Fetch User data if logged in */
onMounted(async () => {
  if (isLoggedIn.value && !storeUser.user.id) {
    await storeUser.getUser(sessionStore.session.id!)
    const prefferedLanguage = storeUser.user.language
    await storeI18n.changeLang(prefferedLanguage)
  }
})

// Check if device is small
const isMobile = ref(false)

/**
 * Updates the isMobile state variable based on the current window width.
 * If the window width is less than 768px, isMobile is set to true, otherwise it is set to false.
 */
function updateIsMobile() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

/**
 * Toggles the application's language setting.
 * Changes the current language in the storeI18n and updates the user's language preference.
 */
async function changeLanguage() {
  await storeI18n.changeLang()
  if (isLoggedIn.value) {
    storeUser.user.language = storeI18n.lang!
    await storeUser.patchUser()
  }
}

/**
 * Logs the user out by calling the logout function of storeUser and
 * redirects to the login page.
 */
const doLogout = async () => {
  storeUser.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="toolbar">
    <figure class="is-hidden-desktop">
      <Logo />
    </figure>

    <!-- Desktop + Tablet -->
    <section class="toolbar-actions is-hidden-mobile">
      <div @click="changeLanguage" class="center clickable language-switcher">
        <Germany v-if="storeI18n.lang === 'en'" />
        <GreatBritain v-else />
      </div>
      <ButtonThemeSwitch v-if="!isMobile" />

      <!-- Only Tablet -->
      <Button
        class="is-hidden-desktop"
        icon="mdi-logout"
        label="Logout"
        color="primary"
        @click="doLogout()"
      />
    </section>

    <!-- Mobile -->
    <section class="toolbar-actions is-hidden-desktop is-hidden-tablet">
      <ButtonThemeSwitch v-if="isMobile" />

      <div @click="changeLanguage" class="center clickable">
        <Germany v-if="storeI18n.lang === 'en'" />
        <GreatBritain v-else />
      </div>

      <Button
        icon="mdi-logout"
        color="primary"
        variant="text"
        v-if="isLoggedIn"
        @click="doLogout()"
      />
    </section>
  </header>
</template>

<style scoped>
@import '@/css/component/Toolbar.css';
</style>

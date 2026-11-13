<script setup lang="ts">
import { StoreUser } from '@/store/StoreUser'
import Button from './Button.vue'
import { computed, watchEffect } from 'vue'
import { useTheme } from 'vuetify'
import { StoreI18n } from '@/store/StoreI18n'

const storeUser = StoreUser()

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

const isDark = computed(() => storeUser.user.darkMode)

const theme = useTheme()

/** Watches changes in the isDark variable and updates the theme */
watchEffect(() => {
  theme.global.name.value = isDark.value ? 'dark' : 'light'
})

/**
 * Toggles the theme between light and dark mode.
 * It calls the storeUser's toggleTheme method to persist the change.
 */
async function toggleTheme() {
  await storeUser.toggleTheme()
}
</script>

<template>
  <Button
    class="is-hidden-desktop is-hidden-tablet"
    :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    color="primary"
    variant="text"
    @click="toggleTheme"
  />

  <Button
    class="is-hidden-mobile"
    :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    :label="translate('theme')"
    color="primary"
    variant="tonal"
    @click="toggleTheme"
  />
</template>

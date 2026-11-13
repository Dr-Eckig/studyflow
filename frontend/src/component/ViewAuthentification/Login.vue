<script setup lang="ts">
import { StoreUser } from '@/store/StoreUser'
import Button from '../Button.vue'
import Input from '../Input.vue'
import { ref } from 'vue'
import { router } from '@/router'
import { toast } from 'vue3-toastify'
import { StoreI18n } from '@/store/StoreI18n'

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key

const newAccount = defineModel<boolean>('newAccount')

const storeUser = StoreUser(),
  user = storeUser.user,
  login = storeUser.login,
  error = ref(false)

// Error Handling
const invalidEmail = ref(false),
  invalidPassword = ref(false)

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

const loading = ref(false)

/**
 * Validate the login fields.
 *
 * Checks if the email address is valid and if a password is provided.
 * Sets error flags and shows toast messages on validation failure.
 * Returns `true` if validation passed, otherwise `false`.
 */
function validateFields() {
  invalidEmail.value = false
  invalidPassword.value = false

  if (!emailRegex.test(user.email)) {
    toast.error(translate('invalid_email'))
    invalidEmail.value = true
  }

  if (!user.password) {
    toast.error(translate('required_password'))
    invalidPassword.value = true
  }
}

/**
 * Handles the login process.
 *
 * Validates the input fields and attempts to login the user.
 * Displays a success toast and redirects on success,
 * or an error toast on failure.
 */
const doLogin = async () => {
  validateFields()
  if (invalidEmail.value || invalidPassword.value) return

  loading.value = true

  const success = await login()
  error.value = !success
  if (!success) {
    toast.error(translate('login_failed'))
    loading.value = false
    return
  }

  toast.success(translate('login_succeeed'))
  router.push({ name: 'home' })

  loading.value = false
}

storeUser.reset()
</script>

<template>
  <h2 class="sheet-title">
    <v-icon>mdi-account-arrow-right-outline</v-icon>
    {{ translate('login') }}
  </h2>
  <Input
    :label="translate('email')"
    v-model:text="user.email"
    @enter="doLogin"
    :error="invalidEmail"
  />
  <Input
    :label="translate('password')"
    v-model:text="user.password"
    @enter="doLogin"
    password
    :error="invalidPassword"
  />
  <Button :label="translate('login')" color="primary" @click="doLogin" :loading="loading" />
  <p class="register-link">
    {{ translate('no_account_yet') }}
    <a href="#" @click.prevent="newAccount = true">{{ translate('register') }}</a>
  </p>
</template>

<style scoped>
@import '@/css/component/ViewAuthentification/Login.css';
</style>

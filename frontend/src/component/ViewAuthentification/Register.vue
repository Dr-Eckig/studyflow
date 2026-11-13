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
  register = storeUser.register,
  error = ref(false),
  passwordRepeat = ref(''),
  passwordMismatch = ref(false),
  invalidEmail = ref(false)

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

const loading = ref(false)

/**
 * Validate the registration fields.
 *
 * Checks if the email address is valid and if the passwords match.
 * Sets error flags and shows toast messages on validation failure.
 * Returns `true` if validation passed, otherwise `false`.
 */
function validateFields() {
  invalidEmail.value = false
  passwordMismatch.value = false

  if (!emailRegex.test(user.email)) {
    toast.error(translate('invalid_email'))
    invalidEmail.value = true
  }

  if ((passwordMismatch.value = user.password !== passwordRepeat.value || !user.password)) {
    toast.error(translate('repeat_password'))
    passwordMismatch.value = true
  }
}

/**
 * Handles the registration process.
 *
 * Validates the input fields and attempts to register the user.
 * Displays a success toast and redirects on success,
 * or an error toast on failure.
 */
const doRegister = async () => {
  validateFields()
  if (passwordMismatch.value || invalidEmail.value) return

  loading.value = true

  const success = await register()
  if (!success) {
    toast.error(translate('registration_failed'))
    error.value = true
    loading.value = false
    return
  }

  toast.success(translate('registration_succeed'))
  router.push({ name: 'home' })

  loading.value = false
}

storeUser.reset()
</script>

<template>
  <h2 class="sheet-title">
    <v-icon>mdi-account-plus-outline</v-icon>
    {{ translate('register') }}
  </h2>
  <Input
    :label="translate('email')"
    v-model:text="user.email"
    @enter="doRegister"
    :error="invalidEmail"
  />
  <Input
    :label="translate('password')"
    v-model:text="user.password"
    @enter="doRegister"
    password
    :error="passwordMismatch"
  />
  <Input
    :label="translate('repeat_password')"
    v-model:text="passwordRepeat"
    @enter="doRegister"
    password
    :error="passwordMismatch"
  />
  <Button :label="translate('register')" color="primary" @click="doRegister" :loading="loading" />
  <p class="register-link">
    {{ translate('already_have_account') }}
    <a href="#" @click.prevent="newAccount = false">{{ translate('login') }}</a>
  </p>
</template>

<style scoped>
@import '@/css/component/ViewAuthentification/Register.css';
</style>

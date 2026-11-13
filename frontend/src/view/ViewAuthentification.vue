<script lang="ts" setup>
import Login from '@/component/ViewAuthentification/Login.vue'
import Register from '@/component/ViewAuthentification/Register.vue'
import { ref } from 'vue'

const newAccount = ref(false)
</script>

<template>
  <section class="login-container">
    <form class="sheet">
      <Register v-if="newAccount" v-model:newAccount="newAccount" />
      <Login v-else v-model:newAccount="newAccount" />
    </form>
  </section>
</template>

<style scoped>
@import '@/css/view/ViewAuthentification.css';
</style>

<script setup lang="ts">
import { StoreI18n } from '@/store/StoreI18n'

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>
<template>
  <nav class="bottom-nav">
    <div class="nav-container">
      <router-link to="/" class="nav-item center" active-class="nav-item-active" exact>
        <v-icon icon="mdi-view-dashboard" />
        <span>{{ translate('dashboard') }}</span>
      </router-link>

      <router-link to="/learning-plan" class="nav-item center" active-class="nav-item-active">
        <v-icon icon="mdi-order-bool-ascending-variant" />
        <span>{{ translate('learning_plan') }}</span>
      </router-link>

      <router-link to="/overview" class="nav-item center" active-class="nav-item-active">
        <v-icon icon="mdi-apps" />
        <span>{{ translate('overview') }}</span>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
@import '@/css/component/BottomNavigation.css';
</style>

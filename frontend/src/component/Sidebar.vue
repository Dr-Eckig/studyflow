<script setup lang="ts">
import Button from '@/component/Button.vue'
import Logo from '@/../public/assets/Logo.vue'
import { StoreUser } from '@/store/StoreUser'
import { router } from '@/router'
import { StoreI18n } from '@/store/StoreI18n'

const storeUser = StoreUser()

const doLogout = async () => {
  storeUser.logout()
  router.push({ name: 'login' })
}

const storeI18n = StoreI18n()
const translate = (key: string) => storeI18n.dictionary[key] || key
</script>

<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <Logo />
    </div>

    <!-- Navigation Elements -->
    <nav>
      <ul>
        <li>
          <router-link to="/" class="nav-link" active-class="nav-link-active" exact>
            <v-icon icon="mdi-view-dashboard" />
            <span>{{ translate('dashboard') }}</span>
          </router-link>
        </li>

        <li>
          <router-link to="/learning-plan" class="nav-link" active-class="nav-link-active">
            <v-icon icon="mdi-order-bool-ascending-variant" />
            <span>{{ translate('learning_plan') }}</span>
          </router-link>
        </li>

        <li>
          <router-link to="/overview" class="nav-link" active-class="nav-link-active">
            <v-icon icon="mdi-apps" />
            <span>{{ translate('overview') }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-logout">
        <Button
          icon="mdi-logout"
          :label="translate('logout')"
          fullwidth
          color="primary"
          @click="doLogout()"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped>
@import '@/css/component/Sidebar.css';
</style>

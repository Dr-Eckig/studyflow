import { createRouter, createWebHistory } from 'vue-router'
import ViewHome from '../view/ViewHome.vue'
import ViewLearningPlan from '../view/ViewLearningPlan.vue'
import ViewOverview from '../view/ViewOverview.vue'
import ViewError404 from '../view/ViewError404.vue'
import { StoreSession } from '@/store/StoreSession'
import ViewAuthentification from '@/view/ViewAuthentification.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ViewHome,
    },
    {
      path: '/login',
      name: 'login',
      component: ViewAuthentification,
    },
    {
      path: '/learning-plan',
      name: 'learning-plan',
      component: ViewLearningPlan,
    },
    {
      path: '/overview',
      name: 'overview',
      component: ViewOverview,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: ViewError404,
    },
  ],
})

/**
 * Global navigation guard to handle authentication-based route access.
 *
 * - Redirects authenticated users away from the login page to the home page.
 * - Prevents unauthenticated users from accessing any routes
 *   except the login and 404 (not-found) pages.
 *
 * @param {RouteLocationNormalized} to - The target route being navigated to.
 * @param {RouteLocationNormalized} from - The current route being navigated from.
 * @param {Function} next - A function to resolve the navigation.
 */
router.beforeEach((to, from, next) => {
  const sessionStore = StoreSession()
  const isLoggedIn = sessionStore.isLoggedIn

  if (to.name === 'login' && isLoggedIn) {
    // already logged in, don't allow access to login page
    return next({ name: 'home' })
  }

  // if not logged in, block access to all except login and 404
  if (!isLoggedIn && !['login', 'not-found'].includes(to.name?.toString() ?? '')) {
    return next({ name: 'login' })
  }

  next()
})

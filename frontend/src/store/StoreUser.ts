import { defineStore } from 'pinia'
import { reactive, computed, inject } from 'vue'

import { StoreSession, type Session } from '@/store/StoreSession'
import { getJson } from '@/service/getJson'
import { patchJson } from '@/service/patchJson'
import { deleteJson } from '@/service/deleteJson'
import { postJson } from '@/service/postJson'
import type { User } from '@/type/model/user'
import { useTheme } from 'vuetify'

interface Config {
  restPaths: {
    register: string
    login: string
    users: string
  }
  default: {
    user: {
      id: ''
      email: ''
      password: ''
      darkMode: false
      language: 'en'
    }
  }
  user: User
}

export const StoreUser = defineStore('user', () => {
  const config = inject<Config>('config')
  if (!config) throw new Error('Config not provided')
  const restPaths = config.restPaths

  const user = reactive<User>({ ...config.default.user })
  const storeSession = StoreSession()
  const session: Session = storeSession.session

  const vuetifyTheme = useTheme()

  /**
   * Resets the user to their default state and the session.
   */
  const reset = () => {
    storeSession.reset()
    Object.assign(user, config.default.user)
  }

  /**
   * Gets the user's information from the server.
   *
   * @param id - the id of the user to get
   * @returns whether the request was successful
   */
  const getUser = async (id: string): Promise<boolean> => {
    const res = await getJson(`${restPaths.users}/${id}`, session)
    Object.assign(user, res.status === 200 ? res.data : config.user)
    return res.status < 300
  }

  /**
   * Updates the user's information on the server.
   *
   * @returns whether the update was successful
   */
  const patchUser = async (): Promise<boolean> => {
    const res = await patchJson(`${restPaths.users}/${user.id}`, user, session)
    return res.status < 300
  }

  /**
   * Deletes the user's account on the server.
   *
   * @returns whether the deletion was successful
   *
   * This function is called when the user clicks the "Delete account" button.
   * It sends a DELETE request to the server with the user's id.
   * If the deletion is successful, it logs the user out by calling reset().
   * If the deletion fails, it returns false.
   */
  const deleteUser = async (): Promise<boolean> => {
    const res = await deleteJson(`${restPaths.users}/${user.id}`, session)
    return res.status < 300
  }

  /**
   * Registers a new user with the server.
   *
   * @returns whether the registration was successful
   *
   * This function is called when the user clicks the "Register" button.
   * It sends a POST request to the server with the user's email and password.
   * If the registration is successful, it logs the user in by calling login().
   * If the registration fails, it returns false.
   */
  const register = async (): Promise<boolean> => {
    const res = await postJson(restPaths.register, {
      email: user.email.trim(),
      password: user.password ? user.password.trim() : '',
      darkMode: false,
      language: 'en',
    })

    if (res.status === 201) {
      return login()
    }

    return res.status < 300
  }

  /**
   * Login the user.
   *
   * @returns whether the login was successful
   */
  const login = async (): Promise<boolean> => {
    const res = await postJson(
      restPaths.login,
      {
        email: user.email.trim(),
        password: user.password ? user.password.trim() : '',
      },
      session,
    )

    if (res.status === 200) {
      await getUser(session.id!)
      user.password = undefined
      vuetifyTheme.global.name.value = user.darkMode ? 'dark' : 'light'
    } else {
      reset()
    }

    return res.status < 300
  }

  /**
   * Toggles the user's theme preference between light and dark.
   * Persists the preference to the backend.
   */
  const toggleTheme = async () => {
    user.darkMode = !user.darkMode
    vuetifyTheme.global.name.value = user.darkMode ? 'dark' : 'light'
    await patchUser()
  }

  /**
   * Toggles the user's language preference between English and German.
   * Persists the preference to the backend.
   */
  const toggleLanguage = async () => {
    user.language = user.language === 'en' ? 'de' : 'en'
    await patchUser()
  }

  const logout = reset

  const isNotAuthorized = computed(() => !session.token)
  const isAuthorized = computed(() => !!session.token)

  const visabilityNotAuthorized = computed(() => (isNotAuthorized.value ? '' : 'hidden'))
  const visabilityAuthorized = computed(() => (isAuthorized.value ? '' : 'hidden'))

  return {
    user,
    register,
    login,
    logout,
    reset,
    getUser,
    patchUser,
    deleteUser,
    toggleTheme,
    toggleLanguage,
    isNotAuthorized,
    isAuthorized,
    visabilityNotAuthorized,
    visabilityAuthorized,
  }
})

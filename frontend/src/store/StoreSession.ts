import { defineStore } from 'pinia'
import { reactive, inject, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  id?: string
  [key: string]: unknown
}

export interface Session {
  token: string | null
  time: number | null
  id: string | null
  errorMessage?: { message: string }
  saveSessionInfo?: (res: ResponseData) => void
}

interface ResponseData {
  token: string | null
  data: {
    constraint?: string
  }
}

interface Config {
  default: {
    session: {
      token: null
      time: null
      id: null
    }
  }
  session: Session
}

/**
 * Check if a JWT token is expired
 * @param token the token to check
 * @returns true if the token is expired, false otherwise
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token)
    if (decoded.exp) {
      return Date.now() >= decoded.exp * 1000
    }
  } catch {
    return true
  }
  return false
}

export const StoreSession = defineStore('session', () => {
  const config = inject<Config>('config')!
  const defaultSession = config.default.session

  const session = reactive<Session>({
    token: null,
    time: null,
    id: null,
  })

  const storedToken = localStorage.getItem('sessionToken')

  const isLoggedIn = computed(
    () => session.token !== null && session.id !== null && !isTokenExpired(session.token),
  )

  /**
   * Updates the session with the given response data.
   * @param res response data with a token and optional constraint data
   * @remarks
   * If the token is invalid or missing, the session will be reset.
   * If the token is new, the session id will be updated and the session will be persisted in local storage.
   */
  const saveSessionInfo = (res: ResponseData) => {
    const c_token = session.token

    session.token = res.token
    session.time = new Date().getTime()

    // auto logout if no new token is passed
    if (c_token != null && session.token == null) {
      Object.assign(session, config.session)
    }

    if (session.token != null) {
      const jwt = jwtDecode<JwtPayload>(session.token ?? '')
      session.id = jwt?.id ?? null
      localStorage.setItem('sessionToken', session.token)
    }
  }

  /**
   * Resets the session to its default state, removing any stored session data in local storage.
   * This will also reset the session id and token.
   * @remarks
   * This method is called automatically if the token is expired.
   */
  const reset = () => {
    Object.assign(session, defaultSession)
    session.saveSessionInfo = saveSessionInfo
    localStorage.removeItem('sessionToken')
  }

  if (storedToken && !isTokenExpired(storedToken)) {
    session.token = storedToken
    session.time = Date.now()
    const jwt = jwtDecode<JwtPayload>(storedToken)
    session.id = jwt?.id ?? null
  } else {
    reset()
  }

  return { session, saveSessionInfo, reset, isLoggedIn }
})

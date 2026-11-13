import type { Session } from '@/store/StoreSession'
import { fetchJson } from './fetchJson'

/**
 * Performs a JSON GET request to the given URL.
 *
 * @param {string} p_url The URL to which the request is sent.
 * @param {Session} [p_session] The session to use for the request. If not specified, no session is used.
 * @returns {Promise<any>} A promise that resolves to the JSON data returned by the server.
 */
export async function getJson(p_url: string, p_session: Session | null = null) {
  return await fetchJson('GET', p_url, null, p_session)
}

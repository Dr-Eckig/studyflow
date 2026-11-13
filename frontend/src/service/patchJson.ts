/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2025
 * @license   MIT
 */
import type { Session } from '@/store/StoreSession'
import { fetchJson } from './fetchJson'
/**
 * @function
 * @param   {string} p_url - REST URL
 * @param   {JSON}   data  - data to be partly replaced by the REST API method <code>PATCH</code>
 * @returns {JSON}   JSON data returned for information purposes: <code>{status, statusText, headers, data}</code>
 */
export async function patchJson(p_url: string, p_data = {}, p_session: Session | null = null) {
  return await fetchJson('PATCH', p_url, p_data, p_session)
}

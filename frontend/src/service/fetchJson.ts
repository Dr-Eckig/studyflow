/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2025
 * @license   MIT
 * @ignore
 */

import type { Session } from '@/store/StoreSession'
import { fetchData } from './fetchData'

/**
 * Performs a JSON fetch request using the specified HTTP method and URL.
 *
 * @param {string} p_method - The HTTP method for the request (e.g., 'GET', 'POST').
 * @param {string} p_url - The URL to which the request is sent.
 * @param {any} [p_data=null] - Optional data to be sent as the request body. It will be stringified as JSON.
 * @param {Session | null} [p_session=null] - Optional session object used for authentication.
 * @returns {Promise<any>} A promise that resolves to the JSON response from the server.
 */
export const fetchJson = async (
  p_method: string,
  p_url: string,
  p_data: any = null,
  p_session: Session | null = null,
): Promise<any> =>
  await fetchData(p_method, p_url, {
    p_data: p_data ? JSON.stringify(p_data) : null,
    p_headers: {
      Accept: 'application/vnd.api+json, application/json',
      'Content-Type': 'application/json',
    },
    p_fetch_json: true,
    p_session,
  })

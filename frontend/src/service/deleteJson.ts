/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2021-2025
 * @license   MIT
 */

import type { Session } from '@/store/StoreSession'
import { fetchJson } from './fetchJson'

/**
 * Führt einen HTTP DELETE-Request aus.
 *
 * @param p_url - REST-URL, die per DELETE gelöscht werden soll.
 * @param p_session - Optionale Session, z. B. für Authentifizierung.
 * @returns Promise mit dem JSON-Ergebnis des DELETE-Requests.
 */
export async function deleteJson(p_url: string, p_session: Session | null = null): Promise<any> {
  return await fetchJson('DELETE', p_url, null, p_session)
}

import type { Session } from '@/store/StoreSession'

type FetchOptions = {
  p_data?: BodyInit | null
  p_headers?: HeadersInit
  p_fetch_json?: boolean
  p_session?: Session | null
}

type FetchResult = {
  status: number
  statusText: string
  headers: Record<string, string>
  token: string | null
  data: any
}

/**
 * Create a RequestInit object with the given parameters.
 *
 * @param {string} p_method Method for the request
 * @param {BodyInit} [p_data] Request body
 * @param {HeadersInit} [p_headers] Request headers
 * @param {Session} [p_session] Session for the request, used to set
 *     Authorization header
 * @returns {RequestInit} RequestInit object
 */
const options = (
  p_method: string,
  p_data?: BodyInit | null,
  p_headers: HeadersInit = {},
  p_session: Session | null = null,
): RequestInit => {
  const method = p_method.toUpperCase()
  return {
    method,
    headers: {
      ...p_headers,
      ...(p_session?.token ? { Authorization: `Bearer ${p_session.token}` } : {}),
    },
    ...(p_data && method !== 'GET' && method !== 'HEAD' ? { body: p_data } : {}),
  }
}

/**
 * Performs a fetch request with the given parameters.
 *
 * @param {string} p_method Method for the request
 * @param {string} p_url URL for the request
 * @param {FetchOptions} p_options Options for the request
 * @property {BodyInit} [p_options.p_data] Request body
 * @property {HeadersInit} [p_options.p_headers] Request headers
 * @property {boolean} [p_options.p_fetch_json=false] If true, the response
 *     data is parsed as JSON. If false, the response data is returned as a Blob.
 * @property {Session} [p_options.p_session] Session for the request, used to
 *     set Authorization header and to save the returned token.
 * @returns {Promise<FetchResult>} Promise that resolves to the result of the
 *     fetch request.
 */
export const fetchData = async (
  p_method: string,
  p_url: string,
  { p_data, p_headers = {}, p_fetch_json = false, p_session = null }: FetchOptions,
): Promise<FetchResult> => {
  const res = await fetch(p_url, options(p_method, p_data, p_headers, p_session))
  const headers: Record<string, string> = {}

  res.headers.forEach((value, name) => {
    headers[name] = value
  })

  const result: FetchResult = {
    status: res.status,
    statusText: res.statusText,
    headers,
    token: headers.authorization ? headers.authorization.split(' ')[1] : null,
    data: res.ok && !p_fetch_json ? await res.blob() : await res.json(),
  }

  if (p_session?.saveSessionInfo != null && result.token) {
    p_session.saveSessionInfo({
      token: result.token,
      data: result.data,
    })
  }

  return result
}

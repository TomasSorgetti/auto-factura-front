export type ApiFieldErrors = Record<string, string>

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fields: ApiFieldErrors
  constructor(status: number, code: string, message: string, fields: ApiFieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

export type ApiList<T> = { data: T[]; nextCursor: string | null }

type RequestOptions = { body?: unknown; signal?: AbortSignal }

type ErrorEnvelope = { error: { status: number; code: string; message: string; fields?: ApiFieldErrors } }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isFieldErrors(value: unknown): value is ApiFieldErrors {
  return isRecord(value) && Object.values(value).every((v) => typeof v === 'string')
}

function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  if (!isRecord(value) || !isRecord(value.error)) return false
  const { status, code, message, fields } = value.error
  return (
    typeof status === 'number' &&
    typeof code === 'string' &&
    typeof message === 'string' &&
    (fields === undefined || isFieldErrors(fields))
  )
}

function isDataEnvelope<T>(value: unknown): value is { data: T } {
  return isRecord(value) && 'data' in value
}

function isListEnvelope<T>(value: unknown): value is ApiList<T> {
  return (
    isRecord(value) &&
    Array.isArray(value.data) &&
    (value.nextCursor === null || typeof value.nextCursor === 'string')
  )
}

async function send(method: string, path: string, options: RequestOptions = {}): Promise<unknown> {
  const { body, signal } = options
  let res: Response
  try {
    res = await fetch('/api' + path, {
      method,
      credentials: 'same-origin',
      signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'NETWORK_ERROR', 'network error')
  }
  if (res.status === 204) return undefined
  const payload: unknown = await res.json().catch(() => undefined)
  if (!res.ok) {
    if (isErrorEnvelope(payload)) {
      const { status, code, message, fields } = payload.error
      throw new ApiError(status, code, message, fields ?? {})
    }
    throw new ApiError(res.status, 'INVALID_RESPONSE', 'invalid response')
  }
  return payload
}

async function request<T>(method: string, path: string, options?: RequestOptions): Promise<T> {
  const payload = await send(method, path, options)
  if (isDataEnvelope<T>(payload)) return payload.data
  throw new ApiError(200, 'INVALID_RESPONSE', 'invalid response')
}

async function requestVoid(method: string, path: string, options?: RequestOptions): Promise<void> {
  await send(method, path, options)
}

async function list<T>(path: string, options?: RequestOptions): Promise<ApiList<T>> {
  const payload = await send('GET', path, options)
  if (isListEnvelope<T>(payload)) return { data: payload.data, nextCursor: payload.nextCursor }
  throw new ApiError(200, 'INVALID_RESPONSE', 'invalid response')
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, options?: RequestOptions) => request<T>('POST', path, options),
  put: <T>(path: string, options?: RequestOptions) => request<T>('PUT', path, options),
  patch: <T>(path: string, options?: RequestOptions) => request<T>('PATCH', path, options),
  delete: (path: string, options?: RequestOptions) => requestVoid('DELETE', path, options),
  list,
}

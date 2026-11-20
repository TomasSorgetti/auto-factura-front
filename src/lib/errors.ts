import { ApiError } from '@/lib/api'

export const API_ERROR_CODES = {
  INVALID_JSON: 'INVALID_JSON',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  CROSS_ORIGIN_REQUEST: 'CROSS_ORIGIN_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INTERNAL: 'INTERNAL',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  SERVICE_NOT_READY: 'SERVICE_NOT_READY',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
} as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]

export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  INVALID_JSON: 'La solicitud no es válida.',
  UNAUTHENTICATED: 'Tu sesión venció. Volvé a ingresar.',
  FORBIDDEN: 'No tenés permiso para hacer esto.',
  CROSS_ORIGIN_REQUEST: 'La solicitud se bloqueó por seguridad. Recargá la página.',
  NOT_FOUND: 'No encontramos lo que buscás.',
  METHOD_NOT_ALLOWED: 'Esta operación no está permitida.',
  PAYLOAD_TOO_LARGE: 'El contenido es demasiado grande.',
  UNSUPPORTED_MEDIA_TYPE: 'El formato de la solicitud no es válido.',
  VALIDATION_FAILED: 'Revisá los datos marcados.',
  INTERNAL: 'Algo salió mal. Probá de nuevo en un rato.',
  REQUEST_TIMEOUT: 'El servidor tardó demasiado. Probá de nuevo.',
  SERVICE_NOT_READY: 'El servicio no está disponible en este momento.',
  NETWORK_ERROR: 'No pudimos conectarnos con el servidor. Revisá tu conexión.',
  INVALID_RESPONSE: 'El servidor respondió algo inesperado.',
}

function isApiErrorCode(code: string): code is ApiErrorCode {
  return Object.hasOwn(ERROR_MESSAGES, code)
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && isApiErrorCode(error.code)) {
    return ERROR_MESSAGES[error.code]
  }
  return ERROR_MESSAGES.INTERNAL
}

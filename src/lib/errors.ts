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
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_INVALID: 'SESSION_INVALID',
  LOGIN_CHALLENGE_INVALID: 'LOGIN_CHALLENGE_INVALID',
  INVALID_TOTP_CODE: 'INVALID_TOTP_CODE',
  INVALID_RECOVERY_CODE: 'INVALID_RECOVERY_CODE',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  TOTP_ALREADY_ENABLED: 'TOTP_ALREADY_ENABLED',
  TOTP_NOT_ENABLED: 'TOTP_NOT_ENABLED',
  CLIENT_CUIT_TAKEN: 'CLIENT_CUIT_TAKEN',
  CLIENT_ARCHIVED: 'CLIENT_ARCHIVED',
  CONTACT_EMAIL_TAKEN: 'CONTACT_EMAIL_TAKEN',
  CONTACT_LIMIT_REACHED: 'CONTACT_LIMIT_REACHED',
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
  INVALID_CREDENTIALS: 'El email o la contraseña no son correctos.',
  SESSION_INVALID: 'Tu sesión venció. Volvé a ingresar.',
  LOGIN_CHALLENGE_INVALID: 'El ingreso venció. Volvé a poner tu email y contraseña.',
  INVALID_TOTP_CODE: 'El código no es válido. Probá con el siguiente que muestre la app.',
  INVALID_RECOVERY_CODE: 'El código de recuperación no es válido o ya se usó.',
  TOO_MANY_ATTEMPTS: 'Demasiados intentos. Esperá unos minutos y probá de nuevo.',
  TOTP_ALREADY_ENABLED: 'El autenticador ya está configurado. Ingresá con tu código.',
  TOTP_NOT_ENABLED: 'Todavía no configuraste el autenticador.',
  CLIENT_CUIT_TAKEN: 'Ya hay un cliente con ese CUIT. Si está archivado, desarchivalo.',
  CLIENT_ARCHIVED: 'El cliente está archivado. Desarchivalo para editarlo.',
  CONTACT_EMAIL_TAKEN: 'Ese email ya está cargado en este cliente.',
  CONTACT_LIMIT_REACHED: 'Llegaste al máximo de 20 contactos para este cliente.',
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

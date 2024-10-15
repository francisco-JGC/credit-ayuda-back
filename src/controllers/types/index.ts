export interface IHandleResponseController<T = unknown> {
  message?: string
  data?: T
  success: boolean
}

// Respuesta de éxito
export const handleSuccess = <T>(
  data: T,
  message?: string
): IHandleResponseController<T> => {
  return {
    success: true,
    data,
    message: message || 'Operación exitosa'
  }
}

// Respuesta de error
export const handleError = <T>(
  message: string
): IHandleResponseController<T> => {
  return {
    success: false,
    message
  }
}

// Respuesta cuando no se encuentra el dato
export const handleNotFound = <T>(
  message: string
): IHandleResponseController<T> => {
  return {
    success: false,
    message: message || 'Dato no encontrado'
  }
}

// PAGINATION
export interface IPagination {
  filter?: string
  page: number
  limit: number
}

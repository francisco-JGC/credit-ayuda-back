import { format, toZonedTime } from 'date-fns-tz'
import { Response, Request, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

declare module 'express' {
  interface Request {
    user?: any
  }
}

export const authorizeRoles = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const authorizationHeader = req.header('Authorization') || ''

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.json({ success: false, message: 'Autorización requerida' })
    }

    const token = authorizationHeader.replace('Bearer ', '')

    if (!token) {
      return res.json({ success: false, message: 'No estás autorizado' })
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as {
        role: string
      }
      req.user = decoded

      if (allowedRoles.includes(decoded.role)) {
        return next()
      } else {
        return res.json({
          success: false,
          message: 'No tienes los permisos necesarios'
        })
      }
    } catch (error) {
      return res.json({ success: false, message: 'Token inválido o expirado' })
    }
  }
}

export const isAllowedTime = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const authorizationHeader = req.header('Authorization') || ''

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.json({ success: false, message: 'Autorización requerida' })
    }

    const token = authorizationHeader.replace('Bearer ', '')

    if (!token) {
      return res.json({ success: false, message: 'No estás autorizado' })
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as {
      role: string
    }
    // Define la zona horaria
    const timeZone = 'America/Guatemala'
    const now = new Date()

    // Convierte la hora a la zona horaria deseada
    const zonedDate = toZonedTime(now, timeZone)
    // Formatea la hora
    const hour = +format(zonedDate, 'HH', { timeZone })
    if (decoded.role === 'admin') {
      return next()
    }

    if (hour >= 8 && hour <= 18) {
      return next()
    }

    return res.json({ success: false, message: 'hour_expired' })
  }
}

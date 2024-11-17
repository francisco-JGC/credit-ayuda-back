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
      const decoded = verify(token, process.env.JWT_SECRET as string) as {
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

import { Response, Request, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

export const authorizeRoles = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    const authorizationHeader = req.header('Authorization') || ''

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Autorización requerida' })
    }

    const token = authorizationHeader.replace('Bearer ', '')

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'No estás autorizado' })
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET as string) as {
        role: string
      }

      if (allowedRoles.includes(decoded.role)) {
        return next()
      } else {
        return res.status(403).json({
          success: false,
          message: 'No tienes los permisos necesarios'
        })
      }
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: 'Token inválido o expirado' })
    }
  }
}

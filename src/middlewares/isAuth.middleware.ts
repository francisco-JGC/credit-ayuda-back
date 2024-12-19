import 'dotenv/config'
import { Response, Request, NextFunction } from 'express'
import { verify, JsonWebTokenError } from 'jsonwebtoken'

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
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

    const decoded = verify(token, process.env.JWT_SECRET!) as {
      role: string
    }

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: 'Porfavor vuelva a iniciar sesion' })
    }

    next()
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(403).json({ success: false, message: 'Token inválido' })
    }

    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' })
  }
}

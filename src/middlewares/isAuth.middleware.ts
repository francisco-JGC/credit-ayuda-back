import { Response, Request, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const authorizationHeader = req.header('Authorization') || ''

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    res.json({ success: false, message: 'Autorización requerida' })
  }

  const token = authorizationHeader.replace('Bearer ', '')

  if (!token) {
    res.json({ success: false, message: 'No estas autorizado' })
  }

  if (verify(token, process.env.JWT_SECRET as string)) next()
  else res.json({ success: false })
}

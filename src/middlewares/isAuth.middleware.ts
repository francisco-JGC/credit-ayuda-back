import { Response, Request, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

export const isAuth = async (
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
    return res.json({ success: false, message: 'No estas autorizado' })
  }

  if (verify(token, process.env.JWT_SECRET as string)) next()
  else return res.json({ success: false })
}

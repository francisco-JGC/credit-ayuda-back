import { format, toZonedTime } from 'date-fns-tz'
import { Router } from 'express'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'
import { isAuth } from '../middlewares/isAuth.middleware'

const router = Router()
router.get('/:role', isAuth, authorizeRoles(['admin', 'collector']), (req, res) => {
  const { role } = req.params
  if (role === 'admin') {
    return res.json({ allowed: true })
  }
  // Define la zona horaria
  const timeZone = 'America/Guatemala'
  const now = new Date()

  // Convierte la hora a la zona horaria deseada
  const zonedDate = toZonedTime(now, timeZone)
  // Formatea la hora
  const hour = +format(zonedDate, 'HH', { timeZone })
  if (hour >= 8 && hour <= 18) {
    return res.json({ allowed: true })
  }

  return res.json({ allowed: false })
})

export default router

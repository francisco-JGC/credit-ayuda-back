import { handleSuccess, IHandleResponseController } from './types'
import { format, toZonedTime } from 'date-fns-tz'

export const isAllowedAccess = async (
  role: string
): Promise<IHandleResponseController<{ allowed: boolean }>> => {
  if (role === 'admin') {
    return handleSuccess({ allowed: true })
  }

  const timeZone = 'America/Guatemala'
  const now = new Date()

  const zonedDate = toZonedTime(now, timeZone)

  const hour = +format(zonedDate, 'HH', { timeZone })
  if (hour >= 8 && hour <= 18) {
    return handleSuccess({ allowed: true })
  }

  return handleSuccess({ allowed: false })
}

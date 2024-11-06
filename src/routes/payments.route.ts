import { Router } from 'express'
import { updatePaymentSchedule } from '../controllers/payment-schedule.controller'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.post('/update/', isAuth, authorizeRoles(['admin', 'inventory']), async (req, res) => {
  return res.json(await updatePaymentSchedule(req.body))
})
export default router

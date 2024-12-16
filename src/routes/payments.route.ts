import { Router } from 'express'
import { getPayment, updatePaymentSchedule } from '../controllers/payment-schedule.controller'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.get('/:id', isAuth, authorizeRoles(['admin', 'collector']), async (req, res) => {
  const id = parseInt(req.params.id)
  return res.json(await getPayment(id))
})

router.post('/update/', isAuth, authorizeRoles(['admin', 'collector']), async (req, res) => {
  return res.json(await updatePaymentSchedule(req.body))
})

export default router

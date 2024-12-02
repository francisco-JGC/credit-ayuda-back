import { Router } from 'express'
import { createPenaltyPlan, getPenaltyPlans } from '../controllers/penalty.controller'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.get('/', isAuth, authorizeRoles(['admin', 'seller']), async (_, res) => {
  const penaltyPlans = await getPenaltyPlans()
  return res.json(penaltyPlans)
})

router.post('/', isAuth, authorizeRoles(['admin', 'seller']), async (req, res) => {
  const penaltyPlan = req.body
  const savedPlan = await createPenaltyPlan(penaltyPlan)
  return res.json(savedPlan)
})

export default router

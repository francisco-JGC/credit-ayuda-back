import { Router } from 'express'
import { addPenaltyPayment, createPenaltyPlan, getPenaltyPlan, getPenaltyPlans } from '../controllers/penalty.controller'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.get('/', isAuth, authorizeRoles(['admin', 'seller']), async (_, res) => {
  const penaltyPlans = await getPenaltyPlans()
  return res.json(penaltyPlans)
})

router.get('/:id', isAuth, authorizeRoles(['admin', 'seller']), async (req, res) => {
  const id = parseInt(req.params.id)
  const penaltyPlan = await getPenaltyPlan(id)
  return res.json(penaltyPlan)
})

router.post('/', isAuth, authorizeRoles(['admin', 'seller']), async (req, res) => {
  const penaltyPlan = req.body
  const savedPlan = await createPenaltyPlan(penaltyPlan)
  return res.json(savedPlan)
})

router.post('/add-payment/:id', isAuth, authorizeRoles(['admin', 'seller']), async (req, res) => {
  const id = parseInt(req.params.id)
  const penaltyPayment = req.body
  const updatedPlan = await addPenaltyPayment(id, penaltyPayment)
  return res.json(updatedPlan)
})

export default router

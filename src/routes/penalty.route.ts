import { Router } from 'express'
import { addPenaltyPayment, createPenaltyPlan, getPenaltyPlan, getPenaltyPlans } from '../controllers/penalty.controller'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles, isAllowedTime } from '../middlewares/authorizeRoles.middleware'

const router = Router()
router.use(isAllowedTime())
router.get('/', isAuth, authorizeRoles(['admin', 'collector']), async (_, res) => {
  const penaltyPlans = await getPenaltyPlans()
  return res.json(penaltyPlans)
})

router.get('/:id', isAuth, authorizeRoles(['admin', 'collector']), async (req, res) => {
  const id = parseInt(req.params.id)
  const penaltyPlan = await getPenaltyPlan(id)
  return res.json(penaltyPlan)
})

router.post('/', isAuth, authorizeRoles(['admin', 'collector']), async (req, res) => {
  const penaltyPlan = req.body
  const savedPlan = await createPenaltyPlan(penaltyPlan)
  return res.json(savedPlan)
})

router.post('/add-payment/:id', isAuth, authorizeRoles(['admin', 'collector']), async (req, res) => {
  const id = parseInt(req.params.id)
  const penaltyPayment = req.body
  const updatedPlan = await addPenaltyPayment(id, penaltyPayment)
  return res.json(updatedPlan)
})

export default router

import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'
import { createRoute, getAllRoutes } from '../controllers/route.controller'

const router = Router()

router.post(
  '/create',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    return res.json(await createRoute(req.body))
  }
)

router.get(
  '/',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (_req, res) => {
    return res.json(await getAllRoutes())
  }
)

export default router

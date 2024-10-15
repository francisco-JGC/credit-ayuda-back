import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { getAllRoles } from '../controllers/role.controller'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.get(
  '/',
  isAuth,
  authorizeRoles(['admin', 'seller', 'inventory']),
  async (_req, res) => {
    res.json(await getAllRoles())
  }
)

export default router

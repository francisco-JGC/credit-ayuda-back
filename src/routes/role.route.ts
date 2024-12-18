import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { getAllRoles } from '../controllers/role.controller'
import { authorizeRoles, isAllowedTime } from '../middlewares/authorizeRoles.middleware'

const router = Router()
router.use(isAllowedTime())
router.get(
  '/',
  isAuth,
  authorizeRoles(['admin', 'collector']),
  async (_req, res) => {
    res.json(await getAllRoles())
  }
)

export default router

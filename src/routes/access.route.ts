import { Router } from 'express'
import { isAllowedAccess } from '../controllers/access.controller'

const router = Router()

router.get('/:role', async (req, res) => {
  return res.json(await isAllowedAccess(req.params.role))
})

export default router

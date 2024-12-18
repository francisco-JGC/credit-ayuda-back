import { Router } from 'express'
import { createRegister, getAllRegisters, updateRegister } from '../controllers/registers.controller'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles, isAllowedTime } from '../middlewares/authorizeRoles.middleware'

const router = Router()
router.use(isAllowedTime())
router.get('/', isAuth, authorizeRoles(['admin']), async (_, res) => {
  return res.json(await getAllRegisters())
})

router.post('/create', isAuth, authorizeRoles(['admin']), async (req, res) => {
  const register = req.body
  return res.json(await createRegister(register))
})

router.post('/update', isAuth, authorizeRoles(['admin']), async (req, res) => {
  const register = req.body
  return res.json(await updateRegister(register))
})

export default router

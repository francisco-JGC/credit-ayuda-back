import { Router } from 'express'
import { createRegister, getAllRegisters, updateRegister } from '../controllers/registers.controller'

const router = Router()

router.get('/', async (_, res) => {
  return res.json(await getAllRegisters())
})

router.post('/create', async (req, res) => {
  const register = req.body
  return res.json(await createRegister(register))
})

router.post('/update', async (req, res) => {
  const register = req.body
  return res.json(await updateRegister(register))
})

export default router

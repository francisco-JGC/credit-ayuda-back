import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'
import {
  createClient,
  deleteClientById,
  getClientById,
  getPaginationClient,
  updateClientById
} from '../controllers/client.controller'

const router = Router()

router.post(
  '/create',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    return res.json(await createClient(req.body))
  }
)

router.get(
  '/:page/:limit/:filter?',
  isAuth,
  authorizeRoles(['admin']),
  async (req, res) => {
    const { page, limit, filter } = req.params

    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    return res.json(
      await getPaginationClient({
        page: pageNumber,
        limit: limitNumber,
        filter
      })
    )
  }
)

router.post('/delete', async (req, res) => {
  res.json(await deleteClientById(req.body.id))
})

router.post('/update/:id', async (req, res) => {
  res.json(await updateClientById(req.body, Number(req.params.id)))
})

router.get('/:id', async (req, res) => {
  res.json(await getClientById(Number(req.params.id)))
})

export default router

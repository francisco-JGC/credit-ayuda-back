import { Router } from 'express'
import {
  createUser,
  deleteUserById,
  updateUserById,
  getPaginationUser,
  getAllUsers,
  getUserById
} from '../controllers/user.controller'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'

const router = Router()

router.get(
  '/',
  isAuth,
  authorizeRoles(['admin', 'seller']),
  async (_req, res) => {
    return res.json(await getAllUsers())
  }
)

router.post(
  '/create',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    return res.json(await createUser(req.body))
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
      await getPaginationUser({
        page: pageNumber,
        limit: limitNumber,
        filter
      })
    )
  }
)

router.post('/delete', async (req, res) => {
  res.json(await deleteUserById(req.body.id))
})

router.post('/update/:id', async (req, res) => {
  res.json(await updateUserById(req.body, Number(req.params.id)))
})

router.get('/:id', async (req, res) => {
  res.json(await getUserById(Number(req.params.id)))
})

export default router

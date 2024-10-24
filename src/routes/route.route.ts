import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'
import {
  createRoute,
  deleteRouteById,
  getAllRoutes,
  getPaginationRoutes,
  getRouteById,
  updateRouteById
} from '../controllers/route.controller'

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
  '/delete/:id',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    return res.json(await deleteRouteById(Number(req.params.id)))
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

router.get(
  '/:id',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    return res.json(await getRouteById(Number(req.params.id)))
  }
)

router.post(
  '/update',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    return res.json(await updateRouteById(req.body))
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
      await getPaginationRoutes({
        page: pageNumber,
        limit: limitNumber,
        filter
      })
    )
  }
)

export default router

import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.middleware'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'
import {
  createLoan,
  getLoanById,
  getLoans,
  getPaginationLoans
} from '../controllers/loan.controller'

const router = Router()

router.post(
  '/create',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    return res.json(await createLoan(req.body))
  }
)

router.get(
  '/:id',
  isAuth,
  authorizeRoles(['admin', 'inventory']),
  async (req, res) => {
    return res.json(await getLoanById(Number(req.params.id)))
  }
)

router.get(
  '/full/:page/:limit/:filter?',
  isAuth,
  authorizeRoles(['admin']),
  async (req, res) => {
    const { page, limit, filter } = req.params

    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    return res.json(
      await getLoans({
        page: pageNumber,
        limit: limitNumber,
        filter
      })
    )
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
      await getPaginationLoans({
        page: pageNumber,
        limit: limitNumber,
        filter
      })
    )
  }
)

export default router

import { Router } from 'express'
import {
  createLoan,
  getLoanById,
  getLoans,
  getPaginationLoans
} from '../controllers/loan.controller'
import { LoanFrequency, LoanStatus } from '../entities/loan/types/loan'
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware'
import { isAuth } from '../middlewares/isAuth.middleware'

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
    const frequency = (req.query.frequency) as LoanFrequency | undefined
    const status = req.query.status as LoanStatus | undefined
    const route = req.query.route as string | undefined

    return res.json(
      await getLoans({
        page: pageNumber,
        limit: limitNumber,
        dni: filter,
        frequency,
        status,
        route
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

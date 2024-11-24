import { Router } from 'express'
import {
  createLoan,
  getFilteredDatesLoans,
  getLoanById,
  getLoans,
  getLoansByRouteUser,
  getPaginationLoans,
  getRequests,
  updateLoan
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
    const frequency = req.query.frequency as LoanFrequency | undefined
    const status = req.query.status as LoanStatus | undefined
    const statuses = req.query.statuses as LoanStatus[] | undefined
    const route = req.query.route as string | undefined

    return res.json(
      await getLoans({
        page: pageNumber,
        limit: limitNumber,
        dni: filter,
        frequency,
        status,
        statuses,
        route
      })
    )
  }
)

router.get(
  '/my-route/full/:page/:limit/:filter?',
  isAuth,
  authorizeRoles(['admin']),
  async (req: any, res) => {
    const { page, limit, filter } = req.params
    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)
    const frequency = req.query.frequency as LoanFrequency | undefined
    const status = req.query.status as LoanStatus | undefined
    const statuses = req.query.statuses as LoanStatus[] | undefined
    const route = req.query.route as string | undefined

    return res.json(
      await getLoansByRouteUser({
        route_name: req.user.route_name,
        page: pageNumber,
        limit: limitNumber,
        dni: filter,
        frequency,
        status,
        statuses,
        route
      })
    )
  }
)

router.get(
  '/requests/:page/:limit/:filter?',
  isAuth,
  authorizeRoles(['admin']),
  async (req, res) => {
    const { page, limit, filter } = req.params
    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)
    const frequency = req.query.frequency as LoanFrequency | undefined
    const route = req.query.route as string | undefined

    return res.json(
      await getRequests({
        page: pageNumber,
        limit: limitNumber,
        dni: filter,
        frequency,
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

router.put('/update', isAuth, authorizeRoles(['admin']), async (req, res) => {
  return res.json(await updateLoan(req.body))
})

router.get(
  '/filter-type/:filterType/date/:date',
  isAuth,
  authorizeRoles(['admin']),
  async (req, res) => {
    return res.json(
      await getFilteredDatesLoans({
        filter_type: req.params.filterType as any,
        date: req.params.date
      })
    )
  }
)

export default router

import { Request, Response, Router } from 'express'
import {
  Debt, Purchase, User,
  DebtCondition,
  PurchaseCondition,
  ReadRepository,
  UserCondition,
} from '../../shared/repository/dist/index.js'

enum Path {
  v1_purchase_list = '/purchase',
  v1_purchase = '/purchase/:id',
  v1_debts_list = '/debt',
  v1_user_list = '/user',
  v1_user = '/user/:id',
  v1_user_login = '/user/:username/login'
}

interface PurchaseListQuery {
  'payer-id'?: string
  payer?: string
  from?: string
  to?: string
}

interface DebtListQuery {
  'purchase-id'?: string
  'creditor-id'?: string
  creditor?: string
  'debtor-id'?: string
  debtor?: string
  accepted?: 'true' | 'false'
}

interface UserListQuery {
  username?: string
}

interface ListResponseBody<T> {
  entries: Array<T>
}

interface SingleResponseBody<T> {
  entry: T
}

interface ErrorResponseBody {
  message: string,
  error?: Array<object>
}

// fixme: Search condition interfaces should not be exported from specific repository implementations.
//  Can we combine them with the query parameters interface or do they have different areas of responsibility?
export const getPurchaseRoutes = (repo: ReadRepository<Purchase, PurchaseCondition>): Router => {

  const router = Router()

  router.get(Path.v1_purchase_list, async (req: Request<undefined, undefined, undefined, PurchaseListQuery>, res: Response<ListResponseBody<Purchase>>, next) => {
    // todo: validate query params format and types
    const searchCondition: PurchaseCondition = {
      // todo: use one 'payer' query parameter with two possible formats (UUID or username)?
      //  In this case, we should prohibit usernames in the UUID format.
      payerId: req.query['payer-id'],
      payerUsername: req.query.payer,
      dateFrom: req.query.from,
      dateTo: req.query.to,
    }
    const purchaseList = await repo.find(searchCondition)
    res.status(200).json({ entries: purchaseList })
    return next()
  })

  router.get(Path.v1_purchase, async (req: Request<{ id: string }>, res: Response<SingleResponseBody<Purchase>>, next) => {
    const purchase = await repo.getById(req.params.id)
    res.status(200).json({ entry: purchase })
    return next()
  })

  return router
}

export const getDebtRoutes = (repo: ReadRepository<Debt, DebtCondition>): Router => {

  const router = Router()

  router.get(Path.v1_debts_list, async (req: Request<undefined, undefined, undefined, DebtListQuery>, res: Response<ListResponseBody<Debt>>, next) => {
    // todo: validate query params format and types
    const searchCondition: DebtCondition = {
      accepted: req.query.accepted === 'true' ? true : req.query.accepted === 'false' ? false : undefined,
      debtorId: req.query['debtor-id'],
      debtorUsername: req.query.debtor,
      creditorId: req.query['creditor-id'],
      creditorUsername: req.query.creditor,
      purchaseId: req.query['purchase-id'],
    }
    const debtList = await repo.find(searchCondition)
    res.status(200).json({ entries: debtList })
    return next()
  })

  return router
}

export const getUserRoutes = (repo: ReadRepository<User, UserCondition>): Router => {

  const router = Router()

  router.get(Path.v1_user_list, async (req: Request<undefined, undefined, undefined, UserListQuery>, res: Response<ListResponseBody<User>>, next) => {
    const searchCondition: UserCondition = {
      username: req.query.username,
    }
    const userList = await repo.find(searchCondition)
    res.status(200).json({ entries: userList })
    return next()
  })

  router.get(Path.v1_user, async (req: Request<{ id: string }>, res: Response<SingleResponseBody<User>>, next) => {
    const user = await repo.getById(req.params.id)
    res.status(200).json({ entry: user })
    return next()
  })

  router.get(Path.v1_user_login, async (req: Request<{ username: string }>, res: Response<SingleResponseBody<User> | ErrorResponseBody>, next) => {
    const searchCondition: UserCondition = {
      username: req.params.username,
    }
    const userList = await repo.find(searchCondition, 1)
    if (userList[0]) {
      res.status(200).json({ entry: userList[0] })
    } else {
      res.status(404).json({ message: `User with username ${req.params.username} not found.` })
    }
    return next()
  })

  return router
}

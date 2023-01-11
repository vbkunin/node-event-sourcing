import { Request, Response, Router } from 'express'
import { Debt, Purchase } from './modules/repository/models.js'
import { DebtCondition, PurchaseCondition, Repository } from './modules/repository/index.js'

enum Path {
  v1_purchase_list = '/purchase',
  v1_purchase = '/purchase/:id',
  v1_debts_list = '/debt'
}

interface PurchaseListQuery {
  'payer-id'?: string,
  payer?: string,
  from?: string,
  to?: string
}

interface DebtListQuery {
  'purchase-id'?: string,
  'creditor-id'?: string,
  creditor?: string,
  'debtor-id'?: string,
  debtor?: string,
  accepted?: 'true' | 'false'
}

interface ListResponseBody<T> {
  entries: Array<T>
}

interface SingleResponseBody<T> {
  entry: T
}

// fixme: Search condition interfaces should not be exported from specific repository implementations.
//  Can we combine them with the query parameters interface or do they have different areas of responsibility?
export const getRoutes = (purchaseRepo: Repository<Purchase, PurchaseCondition>, debtRepo: Repository<Debt, DebtCondition>) => {

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
    const purchaseList = await purchaseRepo.find(searchCondition)
    res.status(200).json({ entries: purchaseList })
    return next()
  })

  router.get(Path.v1_purchase, async (req: Request<{ id: string }>, res: Response<SingleResponseBody<Purchase>>, next) => {
    const purchase = await purchaseRepo.getById(req.params.id)
    res.status(200).json({ entry: purchase })
    return next()
  })

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
    const debtList = await debtRepo.find(searchCondition)
    res.status(200).json({ entries: debtList })
    return next()
  })

  return router
}

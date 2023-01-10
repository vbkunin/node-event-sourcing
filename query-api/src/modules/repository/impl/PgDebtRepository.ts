import { Debt } from '../models.js'
import { PgRepository, PgRepositoryError } from './PgRepository.js'

interface DebtRow {
  id: string,
  purchase_id: string,
  purchase_title: string,
  purchase_date: Date,
  creditor_id: string,
  creditor_username: string,
  debtor_id: string,
  debtor_username: string,
  amount: number,
  remains: number,
  accepted: boolean
}

export interface DebtCondition {
  id?: string,
  purchaseId?: string,
  creditorId?: string,
  creditorUsername?: string,
  debtorId?: string,
  debtorUsername?: string,
  accepted?: boolean
}

export class PgDebtRepository extends PgRepository<Debt, DebtRow, DebtCondition> {
  private countQueryText = `SELECT count(debt.id)::numeric::integer AS count
                            FROM debt
                                     INNER JOIN purchase ON debt.purchase_id = purchase.id
                                     INNER JOIN "user" AS creditor ON debt.creditor_id = creditor.id
                                     INNER JOIN "user" AS debtor ON debt.debtor_id = debtor.id`
  private rowsQueryText = `SELECT debt.id                              AS id,
                                  debt.amount::money::numeric::float8  AS amount,
                                  debt.remains::money::numeric::float8 AS remains,
                                  debt.accepted                        AS accepted,
                                  purchase.id                          AS purchase_id,
                                  purchase.title                       AS purchase_title,
                                  purchase.date                        AS purchase_date,
                                  creditor.id                          AS creditor_id,
                                  creditor.username                    AS creditor_username,
                                  debtor.id                            AS debtor_id,
                                  debtor.username                      AS debtor_username
                           FROM debt
                                    INNER JOIN purchase ON debt.purchase_id = purchase.id
                                    INNER JOIN "user" AS creditor ON debt.creditor_id = creditor.id
                                    INNER JOIN "user" AS debtor ON debt.debtor_id = debtor.id`

  protected makeConditionText(searchCondition: DebtCondition): [(string | boolean), Array<any>] {
    const parts: string[] = []
    const values: string[] = []
    let valueIdx = 0
    for (const [key, value] of Object.entries(searchCondition)) {
      values.push(value)
      valueIdx++
      switch (key) {
        case 'id':
          parts.push(`debt.id = $${valueIdx}`)
          break
        case 'purchaseId':
          parts.push(`debt.purchase_id = $${valueIdx}`)
          break
        case 'accepted':
          parts.push(`debt.accepted = $${valueIdx}`)
          break
        case 'creditorId':
          parts.push(`creditor.id = $${valueIdx}`)
          break
        case 'creditorUsername':
          parts.push(`creditor.username = $${valueIdx}`)
          break
        case 'debtorId':
          parts.push(`debtor.id = $${valueIdx}`)
          break
        case 'debtorUsername':
          parts.push(`debtor.username = $${valueIdx}`)
          break
        default:
          throw new PgRepositoryError(`Unknown condition key '${key}`)
      }
    }
    if (parts.length === 0) {
      throw new PgRepositoryError(`Empty condition ${JSON.stringify(searchCondition)}`)
    }
    const where = parts.join(' AND ')

    return [where, values]
  }

  protected getCountQueryText(): string {
    return this.countQueryText
  }

  protected getRowsQueryText(): string {
    return this.rowsQueryText
  }

  protected rowToEntry(row: DebtRow): Debt {
    return {
      id: row.id,
      purchaseId: row.purchase_id,
      purchaseTitle: row.purchase_title,
      purchaseDate: row.purchase_date,
      creditor: {
        id: row.creditor_id,
        username: row.creditor_username,
      },
      debtor: {
        id: row.debtor_id,
        username: row.debtor_username,
      },
      amount: row.amount,
      remains: row.remains,
      accepted: row.accepted,
    }
  }
}
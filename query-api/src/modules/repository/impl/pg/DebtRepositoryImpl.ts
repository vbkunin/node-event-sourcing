import { Debt } from '../../models.js'
import { RepositoryImpl, RepositoryError } from './RepositoryImpl.js'
import { SearchCondition } from '../../Repository.js'

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

export interface DebtCondition extends SearchCondition {
  id?: string,
  purchaseId?: string,
  creditorId?: string,
  creditorUsername?: string,
  debtorId?: string,
  debtorUsername?: string,
  accepted?: boolean
}

export class DebtRepositoryImpl extends RepositoryImpl<Debt, DebtRow, DebtCondition> {
  private countQueryText = `SELECT count(entry.id)::numeric::integer AS count
                            FROM debt AS entry
                                     INNER JOIN purchase ON entry.purchase_id = purchase.id
                                     INNER JOIN "user" AS creditor ON entry.creditor_id = creditor.id
                                     INNER JOIN "user" AS debtor ON entry.debtor_id = debtor.id`
  private rowsQueryText = `SELECT entry.id                              AS id,
                                  entry.amount::money::numeric::float8  AS amount,
                                  entry.remains::money::numeric::float8 AS remains,
                                  entry.accepted                        AS accepted,
                                  purchase.id                           AS purchase_id,
                                  purchase.title                        AS purchase_title,
                                  purchase.date                         AS purchase_date,
                                  creditor.id                           AS creditor_id,
                                  creditor.username                     AS creditor_username,
                                  debtor.id                             AS debtor_id,
                                  debtor.username                       AS debtor_username
                           FROM debt AS entry
                                    INNER JOIN purchase ON entry.purchase_id = purchase.id
                                    INNER JOIN "user" AS creditor ON entry.creditor_id = creditor.id
                                    INNER JOIN "user" AS debtor ON entry.debtor_id = debtor.id`

  protected makeConditionText(searchCondition: DebtCondition): [(string | boolean), Array<any>] {
    const parts: string[] = []
    const values: string[] = []
    let valueIdx = 0
    for (const [key, value] of Object.entries(searchCondition)) {
      if (value === undefined) continue
      values.push(value)
      valueIdx++
      switch (key) {
        case 'id':
          parts.push(`entry.id = $${valueIdx}`)
          break
        case 'purchaseId':
          parts.push(`entry.purchase_id = $${valueIdx}`)
          break
        case 'accepted':
          parts.push(`entry.accepted = $${valueIdx}`)
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
          throw new RepositoryError(`${this.constructor.name} – Unknown condition key '${key}`)
      }
    }
    const where = parts.length > 0 ? parts.join(' AND ') : true

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
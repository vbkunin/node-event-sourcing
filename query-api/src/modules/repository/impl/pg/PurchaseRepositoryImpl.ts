import { Purchase } from '../../models.js'
import { RepositoryImpl, RepositoryError } from './RepositoryImpl.js'
import { SearchCondition } from '../../Repository.js'

interface PurchaseRow {
  id: string,
  title: string,
  date: Date,
  amount: number,
  payer_id: string,
  payer_username: string
}

export interface PurchaseCondition extends SearchCondition {
  id?: string,
  payerId?: string,
  payerUsername?: string,
  dateFrom?: Date | string,
  dateTo?: Date | string
}

export class PurchaseRepositoryImpl extends RepositoryImpl<Purchase, PurchaseRow, PurchaseCondition> {
  private countQueryText = `SELECT count(entry.id)::numeric::integer AS count
                            FROM purchase AS entry
                                     INNER JOIN "user" AS payer ON entry.payer_id = payer.id`
  private rowsQueryText = `SELECT entry.id                             AS id,
                                  entry.payer_id                       AS payer_id,
                                  payer.username                       AS payer_username,
                                  entry.title                          AS title,
                                  entry.date                           AS "date",
                                  entry.amount::money::numeric::float8 AS amount
                           FROM purchase AS entry
                                    INNER JOIN "user" AS payer ON entry.payer_id = payer.id`

  protected makeConditionText(condition: PurchaseCondition): [(string | boolean), Array<any>] {
    const parts: string[] = []
    const values: string[] = []
    let valueIdx = 0
    for (const [key, value] of Object.entries(condition)) {
      if (value === undefined) continue
      values.push(value)
      valueIdx++
      switch (key) {
        case 'id':
          parts.push(`entry.id = $${valueIdx}`)
          break
        case 'dateFrom':
          parts.push(`entry.date >= $${valueIdx}`)
          break
        case 'dateTo':
          parts.push(`entry.date <= $${valueIdx}`)
          break
        case 'payerId':
          parts.push(`entry.payer_id = $${valueIdx}`)
          break
        case 'payerUsername':
          parts.push(`payer.username = $${valueIdx}`)
          break
        default:
          throw new RepositoryError(`${this.constructor.name} – Unknown condition key '${key}'`)
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

  protected rowToEntry(row: PurchaseRow): Purchase {
    return {
      id: row.id,
      title: row.title,
      date: row.date,
      amount: row.amount,
      payer: {
        id: row.payer_id,
        username: row.payer_username,
      },
    }
  }

}
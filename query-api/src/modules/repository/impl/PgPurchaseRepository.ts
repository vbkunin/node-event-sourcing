import { Pool, QueryConfig } from 'pg'
import { Purchase, PurchaseCondition } from '../models.js'
import { Repository } from '../Repository.js'

interface PurchaseRow {
  id: string,
  title: string,
  date: Date,
  amount: number,
  payer_id: string,
  payer_username: string
}

interface CountRow {
  count: number
}

interface FindParams {
  condition?: PurchaseCondition,
  limit?: number | string,
  offset?: number
}

export class PgPurchaseRepository implements Repository<Purchase, PurchaseCondition> {
  private pool: Pool
  private countQueryText = `SELECT count(p.id)::numeric::integer AS count
                            FROM purchase AS p
                                     INNER JOIN "user" AS u ON p.payer_id = u.id`
  private rowsQueryText = `SELECT p.id                             AS id,
                                  p.payer_id                       AS payer_id,
                                  u.username                       AS payer_username,
                                  p.title                          AS title,
                                  p.date                           AS "date",
                                  p.amount::money::numeric::float8 AS amount
                           FROM purchase AS p
                                    INNER JOIN "user" AS u ON p.payer_id = u.id`

  constructor(pool: Pool) {
    this.pool = pool
  }

  protected async query(queryConfig: QueryConfig): Promise<Purchase[]> {
    const { rows, fields, rowCount } = await this.pool.query<PurchaseRow>(queryConfig)
    return rows.map<Purchase>(row => {
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
    })
  }

  protected makeCondition(condition: PurchaseCondition): [string | boolean, Array<any>] {
    const parts: string[] = []
    const values: string[] = []
    let valueIdx = 0
    for (const [key, value] of Object.entries(condition)) {
      values.push(value)
      valueIdx++
      switch (key) {
        case 'id':
          parts.push(`p.id = $${valueIdx}`)
          break
        case 'dateFrom':
          parts.push(`p.date >= $${valueIdx}`)
          break
        case 'dateTo':
          parts.push(`p.date <= $${valueIdx}`)
          break
        case 'payerId':
          parts.push(`u.id = $${valueIdx}`)
          break
        case 'payerUsername':
          parts.push(`u.username = $${valueIdx}`)
          break
        default:
          throw new Error(`Unknown condition key '${key}`)
      }
    }
    if (parts.length === 0) {
      throw new Error(`Empty condition ${JSON.stringify(condition)}`)
    }
    const where = parts.join(' AND ')

    return [where, values]
  }

  public async find(condition?: PurchaseCondition, limit: number|string = 'ALL', offset: number = 0): Promise<Purchase[]> {
    const [where, values] = condition ? this.makeCondition(condition) : [true, []]
    const queryConfig: QueryConfig = {
      name: 'findPurchase',
      text: `${this.rowsQueryText} WHERE ${where} LIMIT ${limit} OFFSET ${offset}`,
      values,
    }
    // console.log(queryConfig.text)
    return this.query(queryConfig)
  }

  public async getCount(condition?: PurchaseCondition): Promise<number> {
    const [where, values] = condition ? this.makeCondition(condition) : [true, []]
    const queryConfig: QueryConfig = {
      name: 'getPurchaseCount',
      text: `${this.countQueryText} WHERE ${where}`,
      values,
    }
    const { rows } = await this.pool.query<CountRow>(queryConfig)
    return rows[0].count
  }

  public async findById(id: string): Promise<Purchase | null> {
    const queryConfig: QueryConfig<[string]> = {
      name: 'findPurchaseById',
      text: `${this.rowsQueryText} WHERE p.id = $1 LIMIT 1`,
      values: [id],
    }
    return this.query(queryConfig).then(res => res[0] || null)
  }

  public async getById(id: string): Promise<Purchase> {
    return this.findById(id).then(purchase => {
      if (!purchase) {
        // todo: replace with specific error
        throw new Error(`Purchase not found: ${id}`)
      }
      return purchase
    })
  }

}
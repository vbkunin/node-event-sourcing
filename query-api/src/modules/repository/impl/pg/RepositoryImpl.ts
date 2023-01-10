import { Pool, QueryConfig, QueryResultRow } from 'pg'
import { Repository, SearchCondition } from '../../Repository.js'

interface CountRow {
  count: number
}

export abstract class RepositoryImpl<E, R extends QueryResultRow, C extends SearchCondition> implements Repository<E, C> {
  private pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  protected abstract getCountQueryText(): string;

  protected abstract getRowsQueryText(): string;

  protected abstract makeConditionText(searchCondition: C): [(string | boolean), Array<any>];

  protected abstract rowToEntry(row: R): E;

  protected async query(queryConfig: QueryConfig): Promise<E[]> {
    const { rows } = await this.pool.query<R>(queryConfig)
    return rows.map<E>(this.rowToEntry)
  }

  public async find(searchCondition?: C, limit: (number | string) = 'ALL', offset: number = 0): Promise<E[]> {
    const [where, values] = searchCondition ? this.makeConditionText(searchCondition) : [true, []]
    const queryConfig: QueryConfig = {
      name: 'findEntries',
      text: `${this.getRowsQueryText()} WHERE ${where} LIMIT ${limit} OFFSET ${offset}`,
      values,
    }
    // console.log(queryConfig.text)
    return this.query(queryConfig)
  }

  public async getCount(condition?: C): Promise<number> {
    const [where, values] = condition ? this.makeConditionText(condition) : [true, []]
    const queryConfig: QueryConfig = {
      name: 'getEntriesCount',
      text: `${this.getCountQueryText()} WHERE ${where}`,
      values,
    }
    const { rows } = await this.pool.query<CountRow>(queryConfig)
    return rows[0].count
  }

  public async findById(id: string): Promise<E | null> {
    const queryConfig: QueryConfig<[string]> = {
      name: 'findEntryById',
      text: `${this.getRowsQueryText()} WHERE entry.id = $1 LIMIT 1`,
      values: [id],
    }
    return this.query(queryConfig).then(res => res[0] || null)
  }

  public async getById(id: string): Promise<E> {
    return this.findById(id).then(entry => {
      if (!entry) {
        throw new PgRepositoryNotFoundError(`Entry not found: ${id}`)
      }
      return entry
    })
  }

}

export class PgRepositoryError extends Error {}

export class PgRepositoryNotFoundError extends PgRepositoryError {}
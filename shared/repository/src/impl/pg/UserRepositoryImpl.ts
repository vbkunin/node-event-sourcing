import { User } from '../../models.js'
import { RepositoryImpl, RepositoryError } from './RepositoryImpl.js'
import { SearchCondition } from '../../Repository.js'

interface UserRow {
  id: string
  username: string
}

export interface UserCondition extends SearchCondition {
  id?: string
  username?: string
}

export class UserRepositoryImpl extends RepositoryImpl<User, UserRow, UserCondition> {
  private countQueryText = `SELECT count(entry.id)::numeric::integer AS count
                            FROM "user" AS entry`
  private rowsQueryText = `SELECT entry.id                              AS id,
                                  entry.username  AS username
                           FROM "user" AS entry`

  protected makeConditionText(searchCondition: UserCondition): [(string | boolean), Array<string>] {
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
        case 'username':
          parts.push(`entry.username = $${valueIdx}`)
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

  protected rowToEntry(row: UserRow): User {
    return {
      id: row.id,
      username: row.username
    }
  }
}
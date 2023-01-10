export interface Repository<T, C = object> {
  getCount(condition?: C): Promise<number>

  find(condition?: C, limit?: number, offset?: number): Promise<T[]>

  findById(id: string): Promise<T | null>

  getById(id: string): Promise<T>
}
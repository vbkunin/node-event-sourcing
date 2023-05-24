export interface ReadRepository<T, C extends SearchCondition = SearchCondition> {
  getCount(condition?: C): Promise<number>

  find(condition?: C, limit?: number, offset?: number): Promise<T[]>

  findById(id: string): Promise<T | null>

  getById(id: string): Promise<T>
}

export interface SearchCondition {
  id?: string
}
export interface WriteRepository<T> {
  create(entry: T): Promise<T>
}
export abstract class BaseRepository<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract create(data: unknown): Promise<T>;
  abstract update(id: string, data: unknown): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
/**
 * A Least Recently Used (LRU) cache keeps item in the cache until it reaches it's size
 * and/or item limit (only item in our case). In which case, it removes an item that was accessed
 * least recently (by date).
 * An item is considered accessed whenever `has` `get` or `set` is called with it's key
 *
 * Implement the LRU cache provider here and use the lru-cache.test.ts to check your implementation.
 * You're highly encouraged to add additional functions that make working with the cache
 * easier for consumers.
 */

type LRUCacheProviderOptions = {
  itemLimit: number
}
type LRUCacheProvider<T> = {
  has: (key: string) => boolean
  get: (key: string) => T | undefined
  set: (key: string, value: T) => void
}

// TODO: Implement LRU cache provider
export function createLRUCacheProvider<T>({
  itemLimit,
}: LRUCacheProviderOptions): LRUCacheProvider<T> {
  return {
    has: (key) => { },
    get: (key) => { },
    set: (key, value) => { },
  }
}

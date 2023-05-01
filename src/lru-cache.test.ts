import { createLRUCacheProvider } from './lru-cache'

const sleep = (timeoutInMS: number) => new Promise(resolve => setTimeout(resolve, timeoutInMS))

describe('has', () => {
  it('should return false for non-existent key', () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 10 })
    lruCache.set('foo', 'bar')
    expect(lruCache.has('bar')).toEqual(false)
    expect(lruCache.has('')).toEqual(false)
  })
  it('should return true for existing key', () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 10 })
    lruCache.set('foo', 'bar')
    expect(lruCache.has('foo')).toEqual(true)
  })
  it('should return false for expired key', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 1 })
    lruCache.set('foo', 'bar')
    lruCache.set('baz', 'bar')
    expect(lruCache.has('foo')).toEqual(false)
    expect(lruCache.has('baz')).toEqual(true)
  })
  it('should remove least recently used key on item limit', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 2 })
    lruCache.set('foo', 'bar')
    lruCache.set('bar', 'bar')
    await sleep(5)
    lruCache.get('foo')
    lruCache.set('baz', 'bar')
    expect(lruCache.has('foo')).toEqual(true)
    expect(lruCache.has('bar')).toEqual(false)
    expect(lruCache.has('baz')).toEqual(true)
  })
  it('should return true for recreated key after expiration', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 1 })
    lruCache.set('foo', 'bar')
    lruCache.set('baz', 'bar')
    lruCache.set('foo', 'bar')
    expect(lruCache.has('foo')).toEqual(true)
  })
  it('should return true for many existing keys', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 10 })
    lruCache.set('foo', 'bar')
    lruCache.set('baz', 'bar')
    expect(lruCache.has('foo')).toEqual(true)
    expect(lruCache.has('baz')).toEqual(true)
  })
  it('should throw if key is not a string', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 10 })
    // @ts-ignore
    expect(() => lruCache.has(123)).toThrow()
    // @ts-ignore
    expect(() => lruCache.has()).toThrow()
    // @ts-ignore
    expect(() => lruCache.has(undefined)).toThrow()
    // @ts-ignore
    expect(() => lruCache.has(null)).toThrow()
    // @ts-ignore
    expect(() => lruCache.has({ foo: 'bar' })).toThrow()
  })
})

describe('get', () => {
  it('should return undefined for non-existent key', () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 10 })
    lruCache.set('foo', 'bar')
    expect(lruCache.get('bar')).toBeUndefined()
    expect(lruCache.get('')).toBeUndefined()
  })
  it('should return value for existing key', () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 10 })
    lruCache.set('foo', 'bar')
    expect(lruCache.get('foo')).toEqual('bar')
  })
  it('should return undefined for expired key', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 1 })
    lruCache.set('foo', 'bar')
    lruCache.set('baz', 'bar')
    expect(lruCache.get('foo')).toBeUndefined()
    expect(lruCache.get('baz')).toEqual('bar')
  })
  it('should remove least recently used key on item limit', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 2 })
    lruCache.set('foo', 'bar')
    lruCache.set('bar', 'bar')
    await sleep(5)
    lruCache.get('foo')
    lruCache.set('baz', 'bar')
    expect(lruCache.get('foo')).toEqual('bar')
    expect(lruCache.get('bar')).toBeUndefined()
    expect(lruCache.get('baz')).toEqual('bar')
  })
  it('should return true for recreated key after expiration', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 1 })
    lruCache.set('foo', 'bar')
    lruCache.set('baz', 'bar')
    lruCache.set('foo', 'bar')
    expect(lruCache.get('foo')).toEqual('bar')
    expect(lruCache.get('baz')).toBeUndefined()
  })
  it('should return value for many existing keys', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 10 })
    lruCache.set('foo', 'foo')
    lruCache.set('baz', 'baz')
    expect(lruCache.get('foo')).toEqual('foo')
    expect(lruCache.get('baz')).toEqual('baz')
  })
  it('should throw if key is not a string', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 10 })
    // @ts-ignore
    expect(() => lruCache.get(123)).toThrow()
    // @ts-ignore
    expect(() => lruCache.get()).toThrow()
    // @ts-ignore
    expect(() => lruCache.get(undefined)).toThrow()
    // @ts-ignore
    expect(() => lruCache.get(null)).toThrow()
    // @ts-ignore
    expect(() => lruCache.get({ foo: 'bar' })).toThrow()
  })
})

describe('set', () => {
  it('should throw if key is not a string', async () => {
    const lruCache = createLRUCacheProvider<string>({ itemLimit: 10 })
    // @ts-ignore
    expect(() => lruCache.set(123)).toThrow()
    // @ts-ignore
    expect(() => lruCache.set()).toThrow()
    // @ts-ignore
    expect(() => lruCache.set(undefined)).toThrow()
    // @ts-ignore
    expect(() => lruCache.set(null)).toThrow()
    // @ts-ignore
    expect(() => lruCache.set({ foo: 'bar' })).toThrow()
  })
})

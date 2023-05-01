import { createServer } from '.'

let destroyServer: () => Promise<void> | undefined
beforeAll(() => {
  destroyServer = createServer()
})

afterAll(() => {
  destroyServer?.()
})

const makeFetch = (body?: any, path: string = '/synthesis/get') =>
  fetch(`http://localhost:3000${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

const makeFetchWithStatus = (body?: any, path?: string) =>
  makeFetch(body, path).then((res) => res.status)

it('should reject with Bad Request when no body is provided', async () => {
  await expect(makeFetchWithStatus()).resolves.toEqual(400)
})

it('should reject with Bad Request when invalid SSML type provided', async () => {
  await expect(
    makeFetchWithStatus({
      voice: {
        name: 'joanna',
        engine: 'neural',
        language: 'en-US',
      },
    })
  ).resolves.toEqual(400)
  await expect(
    makeFetchWithStatus({
      ssml: 123,
      voice: {
        name: 'joanna',
        engine: 'neural',
        language: 'en-US',
      },
    })
  ).resolves.toEqual(400)
  await expect(
    makeFetchWithStatus({
      ssml: {
        foo: 'bar',
      },
      voice: {
        name: 'joanna',
        engine: 'neural',
        language: 'en-US',
      },
    })
  ).resolves.toEqual(400)
})

it('should reject with Not Found on incorrect URL', async () => {
  await expect(makeFetchWithStatus({}, '/')).resolves.toEqual(404)
  await expect(makeFetchWithStatus({}, '/synthesis/random')).resolves.toEqual(404)
  await expect(makeFetchWithStatus({}, '/random/get')).resolves.toEqual(404)
})

it('should resolve with valid speech marks', async () => {
  await expect(
    makeFetch({
      ssml: '<speak>Hello world</speak>',
      voice: { name: 'joanna', engine: 'neural', language: 'en-US' },
    })
      .then((res) => res.json())
      .then((json) => json.speechMarks.chunks[0].value)
  ).resolves.toEqual('Hello world')
})

/**
 * In this assessment, you'll be building an MVP of the audio server, a service that takes SSML and a voice and returns
 * audio and audio to text mappings. In essence, this is just a proxy server that does some validation, parsing and caching.
 * You'll need to build 3 core components and it's recommended to follow this order:
 *
 * 1. (Least Recently Used) LRU Cache for requests (lru-cache.ts)
 * 2. SSML validator and parser (ssml.ts)
 * 3. Express/Koa/YourPreferredFramework for the API (index.ts)
 *
 * The end result should be an api that takes POST requests at `/synthesis/get`, validates the request (structure and SSML),
 * and returns the response from the synthesis server (or cached response from LRU cache)
 */

import fetch from 'node-fetch'
import { parseSSML, ssmlNodeToText } from './ssml'

export function createServer(): () => Promise<void> {
  /**
   * Create your server here using your preferred framework
   *
   * POST /synthesis/get
   * requestBody: SynthesisRequest
   *
   * And send the body and status from the response of fetchSynthesis:
   */

  // Pseudo-ish code
  const router = new Router().post('/synthesis/get', async (req, res) => {
    const requestBody = req.body
    assertValidRequest(requestBody)

    const ssmlNode = parseSSML(requestBody.ssml)
    const response = await fetchSynthesis({
      text: ssmlNodeToText(ssmlNode),
      voice: requestBody.voice,
    })
    res.status = response.status
    res.body = await response.json()
  })
  const server = new ExpressKoaOrWhateverYouLike().use(router).listen(3000)

  /** Method for destroying server */
  return () => server.close()
}

// TODO: Add error handling and body fetching
function fetchSynthesis({ text, voice }: { text: string; voice: Voice }) {
  return fetch('http://localhost:3001/synthesize', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  })
}

type SynthesisRequest = {
  /** Content to synthesize. E.g. "<speak>Hello world</speak>" https://cloud.google.com/text-to-speech/docs/ssml */
  ssml: string
  voice: Voice
}

type Voice = {
  /** Name of voice to use for API request */
  name: string
  /** Engine of voice to use for API request */
  engine: string
  /** Language of voice to use for API request in the format of en-US */
  language: string
}

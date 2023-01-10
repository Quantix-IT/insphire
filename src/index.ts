import fetch from 'node-fetch'

const SESSION_ERROR_MESSAGES = [
  "Invalid Session ID. Please provide a valid API Session ID. Obtained by calling 'api/sessions/logon'.",
]

export class Insphire {
  baseUrl: string
  username: string
  password: string

  sessionId: string | null
  currentSession: any | null
  currentDepot: string | null
  currentTestmode: boolean

  constructor(baseUrl: string, username: string, password: string) {
    if (!baseUrl) throw new Error('Please provide a base url.')
    if (!username) throw new Error('Please provide a username.')
    if (!password) throw new Error('Please provide a password.')

    this.baseUrl = baseUrl
    this.username = username
    this.password = password

    this.sessionId = null
    this.currentDepot = null
    this.currentSession = null
    this.currentTestmode = false
  }

  getBaseUrl(testmode = false): string {
    return this.baseUrl + (testmode ? 'TEST' : '') + '/api'
  }

  async getSessionId({
    testmode = false,
    depot = '100',
  }: {
    testmode: boolean
    depot: string
  }): Promise<string> {
    const url = this.getBaseUrl(testmode) + '/sessions/logon'

    const payload = {
      USERNAME: this.username,
      PASSWORD: this.password,
      DEPOT: depot,
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data: any = await res.json()

    if (
      data.Message &&
      data.Message ===
        'Unable to locate User resource. Invalid username or password.'
    )
      throw new Error('Invalid insphire username or password')

    if (data.Message && data.Message === 'Invalid Depot Code.')
      throw new Error('Invalid insphire depot')

    this.sessionId = data.SESSIONID
    this.currentSession = data
    this.currentDepot = depot

    return data.SESSIONID
  }

  async request({
    endpoint,
    params = {},
    method = 'GET',
    headers = {},
    payload = null,
    testmode = false,
    depot = '100',
  }: {
    endpoint: string
    params: object
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers: object
    payload: any
    testmode: boolean
    depot: string
  }): Promise<any> {
    if (
      !this.sessionId ||
      testmode !== this.currentTestmode ||
      depot !== this.currentDepot
    )
      await this.getSessionId({ testmode, depot })

    const query = new URLSearchParams({
      ...params,
      api_key: this.sessionId!,
    }).toString()

    const url = this.getBaseUrl(testmode) + endpoint + '?' + query

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    })
    const data: any = await res.json()

    if (data.Message && SESSION_ERROR_MESSAGES.includes(data.Message)) {
      await this.getSessionId({ testmode, depot })
      return await this.request({
        endpoint,
        params,
        method,
        headers,
        payload,
        testmode,
        depot,
      })
    }

    return data
  }
}

export default Insphire

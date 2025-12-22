import { describe, it, expect, beforeEach, vi } from 'vitest'
import AxiosMockAdapter from 'axios-mock-adapter'
import { PaymentServiceClient, ApiError } from '@/lib/paymentServiceClient'

describe('PaymentServiceClient (axios behavior)', () => {
  let client: PaymentServiceClient
  let mock: AxiosMockAdapter

  beforeEach(() => {
    client = new PaymentServiceClient({ baseURL: 'http://test' })
    // attach mock adapter to the internal axios instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mock = new AxiosMockAdapter((client as any).client)
    mock.reset()
  })

  it('includes Authorization and X-Idempotency-Key headers when provided', async () => {
    // make window + localStorage available so setToken works
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).window = {}
    const storageMock = { setItem: vi.fn(), getItem: vi.fn(() => 'secret-token'), removeItem: vi.fn() }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).localStorage = storageMock

    client.setToken('secret-token')

    mock.onPost('/api/payments/transfer').reply((config) => {
      // Axios may supply headers as an object or AxiosHeaders
      const auth = (config.headers as any).Authorization ||
        ((config.headers as any).get && (config.headers as any).get('Authorization'))
      const idem = (config.headers as any)['X-Idempotency-Key'] || (config.headers as any).get?.('X-Idempotency-Key')

      expect(auth).toBe('Bearer secret-token')
      expect(idem).toBe('idem-abc')

      return [200, {
        transactionId: 'tx-1',
        status: 'COMPLETED',
        amountCents: 123
      }]
    })

    const res = await client.transfer({ idempotencyKey: 'idem-abc', fromUserId: 'u1', toUserId: 'u2', amountCents: 123 })
    expect(res.transactionId).toBe('tx-1')
  })

  it('converts axios errors to ApiError and invokes onError callback', async () => {
    const onError = vi.fn()
    // Create new client with onError hook
    const c = new PaymentServiceClient({ baseURL: 'http://test', onError })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = new AxiosMockAdapter((c as any).client)

    m.onPost('/api/payments/transfer').reply(400, { code: 'INVALID', message: 'Invalid request' })

    await expect(c.transfer({ fromUserId: 'a', toUserId: 'b', amountCents: 1 })).rejects.toMatchObject({
      statusCode: 400,
      code: 'INVALID',
      message: 'Invalid request'
    })

    expect(onError).toHaveBeenCalled()
  })

  it('getByIdempotencyKey returns null when server responds 404', async () => {
    mock.onGet('/api/payments/idempotency/not-found').reply(404, { code: 'NOT_FOUND', message: 'Not found' })

    const out = await client.getByIdempotencyKey('not-found')
    expect(out).toBeNull()
  })

  it('setToken and clearToken use localStorage when available', () => {
    // simulate browser
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).window = {}
    const storageMock = { setItem: vi.fn(), getItem: vi.fn(), removeItem: vi.fn() }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).localStorage = storageMock

    client.setToken('abc')
    expect(storageMock.setItem).toHaveBeenCalledWith('accessToken', 'abc')

    client.clearToken()
    expect(storageMock.removeItem).toHaveBeenCalledWith('accessToken')
  })
})

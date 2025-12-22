import { describe, it, expect, beforeEach } from 'vitest'
import MockPaymentServiceClient from '@/lib/mockPaymentClient'

describe('MockPaymentServiceClient', () => {
  let client: MockPaymentServiceClient

  beforeEach(() => {
    client = new MockPaymentServiceClient()
  })

  it('transfer returns completed transfer with transactionId', async () => {
    const resp = await client.transfer({ fromUserId: 'u1', toUserId: 'u2', amountCents: 1000 })
    expect(resp.transactionId).toBeDefined()
    expect(resp.status).toBe('COMPLETED')
    expect(resp.amountCents).toBe(1000)
  })

  it('idempotency keys return same response', async () => {
    const key = 'idem-123'
    const a = await client.transfer({ idempotencyKey: key, fromUserId: 'u1', toUserId: 'u2', amountCents: 500 })
    const b = await client.transfer({ idempotencyKey: key, fromUserId: 'u1', toUserId: 'u2', amountCents: 500 })
    expect(b.transactionId).toBe(a.transactionId)
  })

  it('getByIdempotencyKey returns stored transfer or null', async () => {
    const key = 'idem-456'
    const pre = await client.getByIdempotencyKey(key)
    expect(pre).toBeNull()

    const created = await client.transfer({ idempotencyKey: key, fromUserId: 'a', toUserId: 'b', amountCents: 200 })
    const fetch = await client.getByIdempotencyKey(key)
    expect(fetch).toEqual(created)
  })

  it('listTransactions returns paginated items', async () => {
    // create multiple transactions
    for (let i = 0; i < 5; i++) {
      await client.transfer({ fromUserId: `u${i}`, toUserId: `v${i}`, amountCents: 100 * i })
    }
    const res = await client.listTransactions({ page: 0, size: 10 })
    expect(res.items.length).toBeGreaterThanOrEqual(5)
    expect(res.total).toBeDefined()
  })
})
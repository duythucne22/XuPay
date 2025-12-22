import { describe, it, expect, beforeEach } from 'vitest'
import { setDefaultPaymentServiceClient } from '@/lib/paymentServiceClient'
import MockPaymentServiceClient from '@/lib/mockPaymentClient'
import { transactionsApi } from '@/lib/api'

describe('API shim (transactionsApi)', () => {
  beforeEach(() => {
    setDefaultPaymentServiceClient(new MockPaymentServiceClient())
  })

  it('getTransactions returns a PaginatedDTO with content array', async () => {
    // create some transactions via mock client
    const client = new MockPaymentServiceClient()
    await client.transfer({ fromUserId: 'u1', toUserId: 'u2', amountCents: 100 })
    await client.transfer({ fromUserId: 'u3', toUserId: 'u4', amountCents: 200 })

    // ensure shim uses set default client
    const paged = await transactionsApi.getTransactions({ page: 0, size: 10 })
    expect(paged.content).toBeDefined()
    expect(Array.isArray(paged.content)).toBe(true)
    expect(paged.totalElements).toBeGreaterThanOrEqual(0)
  })
})
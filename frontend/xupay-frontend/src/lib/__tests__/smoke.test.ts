import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'
import { getUserServiceClient } from '@/lib/userServiceClient'
import { getPaymentServiceClient } from '@/lib/paymentServiceClient'

// MSW smoke test that verifies login -> transfer -> balance using mock handlers

describe('MSW smoke: login -> transfer -> balance', () => {
  const server = setupServer(...handlers)

  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
  afterAll(() => server.close())

  it('login, make a transfer, and verify wallet balance is returned', async () => {
    const userClient = getUserServiceClient()
    const payClient = getPaymentServiceClient()

    const auth = await userClient.login({ email: 'smoke@example.com', password: 'x' })
    expect(auth.accessToken).toBeTruthy()
    expect(auth.user).toBeTruthy()

    userClient.setToken(auth.accessToken)
    payClient.setToken(auth.accessToken)

    const tx = await payClient.transfer({ idempotencyKey: 'smoke-1', fromUserId: auth.user.id, toUserId: 'receiver-1', amountCents: 1000 })
    expect(tx.transactionId).toBeTruthy()
    expect(tx.status).toBe('COMPLETED')

    const wallet = await payClient.getWalletByUserId(auth.user.id)
    expect(wallet).toHaveProperty('balanceCents')
    expect(typeof wallet.balanceCents).toBe('number')
  })
})

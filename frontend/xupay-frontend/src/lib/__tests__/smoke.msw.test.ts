import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'
import { getUserServiceClient } from '@/lib/userServiceClient'
import { getPaymentServiceClient } from '@/lib/paymentServiceClient'

// This test spins up the MSW server and verifies an end-to-end flow:
// Register/Login -> Transfer -> Get Wallet By User

describe('MSW smoke: login -> transfer -> balance', () => {
  const server = setupServer(...handlers)

  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
  afterAll(() => server.close())

  it('login, make a transfer, and verify wallet balance is returned', async () => {
    const userClient = getUserServiceClient()
    const payClient = getPaymentServiceClient()

    // Perform login (returns a token + user)
    const auth = await userClient.login({ email: 'smoke@example.com', password: 'x' })
    expect(auth.accessToken).toBeTruthy()
    expect(auth.user).toBeTruthy()

    // Set token so the Payment client will include Authorization header
    userClient.setToken(auth.accessToken)
    payClient.setToken(auth.accessToken)

    // Make a transfer - use idempotency key to ensure deterministic behavior
    const tx = await payClient.transfer({ idempotencyKey: 'smoke-1', fromUserId: auth.user.id, toUserId: 'receiver-1', amountCents: 1000 })
    expect(tx.transactionId).toBeTruthy()
    expect(tx.status).toBe('COMPLETED')

    // Fetch the wallet by user id - MSW creates wallets with non-zero balance for user
    const wallet = await payClient.getWalletByUserId(auth.user.id)
    expect(wallet).toHaveProperty('balanceCents')
    expect(typeof wallet.balanceCents).toBe('number')
  })
})

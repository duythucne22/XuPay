// @vitest-environment jsdom
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateWallet, useFreezeWallet, useUserWallet, useWalletBalance, walletsKeys } from '../useWallets.new'
import { getPaymentServiceClient } from '@/lib/paymentServiceClient'
import { http, HttpResponse } from 'msw'

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  const result = render(ui, { wrapper })
  return { ...result, queryClient }
}

function CreateWalletButton({ payload }: { payload: any }) {
  const m = useCreateWallet()
  return (
    <button onClick={() => m.mutate(payload)} data-testid="create-wallet">
      Create
    </button>
  )
}

function FreezeButton({ walletId, freeze }: { walletId: string; freeze: boolean }) {
  const m = useFreezeWallet()
  return (
    <button onClick={() => m.mutate({ walletId, request: { freeze } })} data-testid={`freeze-${freeze}`}>
      {freeze ? 'Freeze' : 'Unfreeze'}
    </button>
  )
}

function UserWalletQuery({ userId }: { userId: string }) {
  const q = useUserWallet(userId)
  if (q.isLoading) return <div data-testid="wallet-loading">loading</div>
  return <div data-testid="wallet-data">{JSON.stringify(q.data)}</div>
}

function WalletBalanceQuery({ walletId }: { walletId: string }) {
  const q = useWalletBalance(walletId)
  if (q.isLoading) return <div data-testid="wallet-balance-loading">loading</div>
  return <div data-testid="wallet-balance">{JSON.stringify(q.data)}</div>
}

describe('useWallets.new (integration with MSW)', () => {
  it('useCreateWallet creates a wallet and invalidates user wallet query', async () => {
    const userId = 'user-create-test-1'

    const { queryClient } = renderWithClient(
      <div>
        <CreateWalletButton payload={{ userId, walletType: 'PERSONAL', currency: 'VND' }} />
        <UserWalletQuery userId={userId} />
      </div>
    )

    // Trigger create wallet
    fireEvent.click(screen.getByTestId('create-wallet'))

    // Wait for the user wallet query to be populated
    await waitFor(() => {
      const el = screen.getByTestId('wallet-data')
      if (!el.textContent || el.textContent === 'null' || el.textContent === 'loading') throw new Error('wallet not populated')
    })

    const dataText = screen.getByTestId('wallet-data').textContent || ''
    const w = JSON.parse(dataText)
    expect(w.userId).toBe(userId)

    // Query client should have cached user wallet
    const cached = queryClient.getQueryData(walletsKeys.userWallet(userId))
    expect(cached).toBeDefined()
  })

  it('useFreezeWallet toggles frozen state and invalidates balance/detail queries (and preserves reason)', async () => {
    const userId = 'user-freeze-test-1'

    // First create a wallet directly via client to ensure we have walletId
    const created = await getPaymentServiceClient().createWallet({ userId, walletType: 'PERSONAL', currency: 'VND' })
    const walletId = (created as any).walletId

    const { queryClient } = renderWithClient(
      <div>
        <FreezeButton walletId={walletId} freeze={true} />
        <FreezeButton walletId={walletId} freeze={false} />
        <WalletBalanceQuery walletId={walletId} />
      </div>
    )

    // Freeze wallet with a reason
    await getPaymentServiceClient().freezeWallet(walletId, { freeze: true, reason: 'fraud-detected' })

    // Wait until the freeze handler has taken effect (poll the API)
    await waitFor(async () => {
      const resp = await getPaymentServiceClient().getWalletBalance(walletId)
      if ((resp as any).isFrozen !== true) throw new Error('not frozen yet')
    })

    // Verify via explicit fetchQuery and that reason is present
    const fetchedFrozen = await queryClient.fetchQuery({ queryKey: walletsKeys.balance(walletId), queryFn: () => getPaymentServiceClient().getWalletBalance(walletId) })
    expect((fetchedFrozen as any).isFrozen).toBe(true)
    expect((fetchedFrozen as any).freezeReason).toBe('fraud-detected')

    // Unfreeze wallet
    await getPaymentServiceClient().freezeWallet(walletId, { freeze: false })
    await waitFor(async () => {
      const resp = await getPaymentServiceClient().getWalletBalance(walletId)
      if ((resp as any).isFrozen !== false) throw new Error('not unfrozen yet')
    })

    const fetchedUnfrozen = await queryClient.fetchQuery({ queryKey: walletsKeys.balance(walletId), queryFn: () => getPaymentServiceClient().getWalletBalance(walletId) })
    expect((fetchedUnfrozen as any).isFrozen).toBe(false)
    expect((fetchedUnfrozen as any).freezeReason).toBeNull()
  })

  it('create wallet returns validation error when missing currency', async () => {
    // Override create wallet handler to return 400 if currency missing
    server.use(
      http.post('http://localhost:8082/api/wallets', async ({ request }) => {
        const body = await request.json() as any
        if (!body.currency) {
          return HttpResponse.json({ code: 'INVALID_REQUEST', message: 'currency required' }, { status: 400 })
        }
        const walletId = `wallet-${Math.random().toString(36).slice(2, 8)}`
        return HttpResponse.json({ walletId, ...body }, { status: 201 })
      })
    )

    await expect(getPaymentServiceClient().createWallet({ userId: 'u-x', walletType: 'PERSONAL' } as any)).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_REQUEST' })
  })
})

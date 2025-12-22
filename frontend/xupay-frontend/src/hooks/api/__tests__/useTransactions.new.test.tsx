// @vitest-environment jsdom
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTransfer, useTransactionByIdempotencyKey, useTransactions, transactionsKeys } from '../useTransactions.new'
import { walletsKeys } from '../useWallets.new'
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

// Test helpers
function TransferButton({ payload }: { payload: any }) {
  const mutation = useTransfer()
  return (
    <button onClick={() => mutation.mutate(payload)} data-testid="transfer-btn">
      Transfer
    </button>
  )
}

function IdempotencyQuery({ idempotencyKey }: { idempotencyKey: string }) {
  const q = useTransactionByIdempotencyKey(idempotencyKey)
  if (q.isLoading) return <div data-testid="tx-by-key">loading</div>
  return <div data-testid="tx-by-key">{JSON.stringify(q.data)}</div>
}

function ListQuery({ userId }: { userId: string }) {
  const q = useTransactions({ userId })
  if (q.isLoading) return <div data-testid="tx-list">loading</div>
  return <div data-testid="tx-list">{JSON.stringify((q.data as any)?.content || q.data)}</div>
}

describe('useTransactions.new (integration with MSW)', () => {
  it('creates a transfer, caches detail, and is discoverable by idempotency and list', async () => {
    const fromUser = '11111111-1111-1111-1111-111111111111'
    const toUser = '22222222-2222-2222-2222-222222222222'
    const idempotencyKey = `key-${Math.random().toString(36).slice(2, 8)}`

    const { queryClient } = renderWithClient(
      <div>
        <TransferButton payload={{ idempotencyKey, fromUserId: fromUser, toUserId: toUser, amountCents: 10000 }} />
        <IdempotencyQuery idempotencyKey={idempotencyKey} />
        <ListQuery userId={fromUser} />
      </div>
    )

    // Trigger transfer
    fireEvent.click(screen.getByTestId('transfer-btn'))

    // Wait for list query for fromUser to include the transaction (MSW handler returns transactions on listing)
    await waitFor(() => {
      const el = screen.getByTestId('tx-list')
      if (!el.textContent || el.textContent === 'loading') throw new Error('list not populated yet')
    })

    // Now explicitly fetch by idempotency key to ensure the endpoint is queried after the transfer
    await queryClient.fetchQuery({ queryKey: transactionsKeys.byIdempotencyKey(idempotencyKey), queryFn: () => getPaymentServiceClient().getByIdempotencyKey(idempotencyKey) })

    const byKeyData = queryClient.getQueryData(transactionsKeys.byIdempotencyKey(idempotencyKey))
    expect(byKeyData).toBeTruthy()
    const tx = byKeyData as any
    expect(tx.transactionId).toBeDefined()

    // Transaction detail should now be cached
    const cached = queryClient.getQueryData(transactionsKeys.detail(tx.transactionId))
    expect(cached).toBeDefined()
    expect((cached as any).transactionId).toEqual(tx.transactionId)

    const listText = screen.getByTestId('tx-list').textContent || ''
    const list = JSON.parse(listText)
    // If list is a paginated DTO, check content/items array
    const items = Array.isArray(list) ? list : (list.content || list.items || [])
    expect(Array.isArray(items)).toBe(true)
    // At least one item should match our transaction id or amount
    const found = items.find((i: any) => i.transactionId === tx.transactionId || i.amountCents === 10000)
    expect(found).toBeTruthy()

    // Wallet queries for both users should be invalidated/refetched (we expect a query state or data to exist after mutation)
    // We at least assert that invalidateQueries did not crash and that queries are present (handlers provide wallet endpoints)
    // Trigger a user-wallet fetch to ensure endpoint works
    await queryClient.fetchQuery({ queryKey: walletsKeys.userWallet(fromUser), queryFn: () => getPaymentServiceClient().getWalletByUserId(fromUser) })
    const wallet = queryClient.getQueryData(walletsKeys.userWallet(fromUser))
    expect(wallet).toBeDefined()
  })

  it('idempotency duplicates return the same transaction and do not create duplicates', async () => {
    const idKey = `key-${Math.random().toString(36).slice(2, 8)}`
    const payload = { idempotencyKey: idKey, fromUserId: 'u1', toUserId: 'u2', amountCents: 5000 }

    // Call transfer twice via client
    const r1 = await getPaymentServiceClient().transfer(payload)
    const r2 = await getPaymentServiceClient().transfer(payload)

    expect(r1.transactionId).toBeDefined()
    expect(r1.transactionId).toEqual(r2.transactionId)

    // Fetch by idempotency key and ensure same resource
    const byKey = await getPaymentServiceClient().getByIdempotencyKey(idKey)
    expect(byKey).toBeTruthy()
    expect(byKey!.transactionId).toEqual(r1.transactionId)

    // Ensure listing does not include duplicates (only one transaction with this id)
    const listed = await getPaymentServiceClient().listTransactions({})
    const occurrences = listed.items.filter((i: any) => i.idempotencyKey === idKey)
    expect(occurrences.length).toBe(1)
  })

  it('transfer returns INSUFFICIENT_FUNDS error when server responds 422', async () => {
    // Override transfer handler to return 422 for large amounts
    server.use(
      http.post('http://localhost:8082/api/payments/transfer', async ({ request }) => {
        const body = await request.json() as any
        if (body.amountCents > 100000000) {
          return HttpResponse.json({ code: 'INSUFFICIENT_FUNDS', message: 'Insufficient funds' }, { status: 422 })
        }
        return HttpResponse.json({ transactionId: 'tx-fallback' }, { status: 201 })
      })
    )

    const bigPayload = { idempotencyKey: `k-${Math.random().toString(36).slice(2, 8)}`, fromUserId: 'rich', toUserId: 'poor', amountCents: 999999999 }

    await expect(getPaymentServiceClient().transfer(bigPayload)).rejects.toMatchObject({ statusCode: 422, code: 'INSUFFICIENT_FUNDS' })
  })

  it('concurrent transfers with same idempotency key return same transaction and do not create duplicates', async () => {
    const idKey = `ck-${Math.random().toString(36).slice(2, 8)}`
    const payload = { idempotencyKey: idKey, fromUserId: 'u-conc', toUserId: 'v-conc', amountCents: 1234 }

    // Fire several transfers concurrently with the same idempotency key
    const tasks = Array.from({ length: 5 }).map(() => getPaymentServiceClient().transfer(payload))
    const results = await Promise.all(tasks)

    // All should resolve to the same transaction id
    const txIds = new Set(results.map((r: any) => r.transactionId))
    expect(txIds.size).toBe(1)

    // Ensure the idempotency lookup and listing only show a single occurrence
    const listed = await getPaymentServiceClient().listTransactions({})
    const occurrences = listed.items.filter((i: any) => i.idempotencyKey === idKey)
    expect(occurrences.length).toBe(1)
  })

  it('concurrent transfers without idempotency key create multiple transactions', async () => {
    const payload = { fromUserId: 'u-nokey', toUserId: 'v-nokey', amountCents: 1111 }

    // Fire multiple transfers concurrently without any idempotency keys
    const tasks = Array.from({ length: 4 }).map(() => getPaymentServiceClient().transfer(payload))
    const results = await Promise.all(tasks)

    // Expect distinct transaction ids for each call
    const txIds = results.map((r: any) => r.transactionId)
    const unique = new Set(txIds)
    expect(unique.size).toBe(results.length)

    // Listing should include at least the number of created transactions
    const listed = await getPaymentServiceClient().listTransactions({})
    const occurrences = listed.items.filter((i: any) => i.fromUserId === 'u-nokey' && i.amountCents === 1111)
    expect(occurrences.length).toBeGreaterThanOrEqual(4)
  })
})

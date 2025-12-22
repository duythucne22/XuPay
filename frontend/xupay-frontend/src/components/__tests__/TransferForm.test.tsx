// @vitest-environment jsdom
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TransferForm from '../TransferForm'
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

describe('TransferForm component', () => {
  it('shows validation errors when fields missing', async () => {
    renderWithClient(<TransferForm defaultFromUserId="u1" />)

    // submit without filling recipient or amount
    fireEvent.click(screen.getByTestId('submit-btn'))

    await waitFor(() => screen.getByTestId('local-error'))
    expect(screen.getByTestId('local-error').textContent).toContain('Recipient')
  })

  it('submits a transfer successfully and shows success message', async () => {
    const idKey = `tf-${Math.random().toString(36).slice(2, 8)}`
    const { queryClient } = renderWithClient(<TransferForm defaultFromUserId="sender-1" />)

    fireEvent.change(screen.getByTestId('toUserId'), { target: { value: 'receiver-1' } })
    fireEvent.change(screen.getByTestId('amountCents'), { target: { value: '1000' } })
    fireEvent.change(screen.getByTestId('idempotencyKey'), { target: { value: idKey } })

    fireEvent.click(screen.getByTestId('submit-btn'))

    // wait for success state
    await waitFor(() => screen.getByTestId('success'))
    expect(screen.getByTestId('success').textContent).toContain('Transaction')

    // ensure idempotency lookup returns the created transaction
    await queryClient.fetchQuery({ queryKey: ['transactions', 'idempotency', idKey], queryFn: () => getPaymentServiceClient().getByIdempotencyKey(idKey) })
    const byKey = queryClient.getQueryData(['transactions', 'idempotency', idKey])
    expect(byKey).toBeTruthy()
  })

  it('shows server validation error (422) when transfer is insufficient funds', async () => {
    // override transfer to return 422 for large amounts
    server.use(
      http.post('http://localhost:8082/api/payments/transfer', async ({ request }) => {
        const body = await request.json() as any
        if (body.amountCents > 100000000) {
          return HttpResponse.json({ code: 'INSUFFICIENT_FUNDS', message: 'Insufficient funds' }, { status: 422 })
        }
        return HttpResponse.json({ transactionId: 'tx-fallback' }, { status: 201 })
      })
    )

    renderWithClient(<TransferForm defaultFromUserId="rich" />)

    fireEvent.change(screen.getByTestId('toUserId'), { target: { value: 'poor' } })
    fireEvent.change(screen.getByTestId('amountCents'), { target: { value: '999999999' } })
    fireEvent.click(screen.getByTestId('submit-btn'))

    await waitFor(() => screen.getByTestId('api-error'))
    expect(screen.getByTestId('api-error').textContent).toContain('Insufficient funds')
  })

  it('disables submit button while mutation is in progress', async () => {
    // stub the client's transfer method to control timing
    const payClient: any = getPaymentServiceClient()
    const original = payClient.transfer

    let resolveTransfer: (value?: any) => void
    const pending = new Promise((res) => { resolveTransfer = res })
    const spy = vi.spyOn(payClient, 'transfer').mockImplementation(() => pending)

    try {
      renderWithClient(<TransferForm defaultFromUserId="busy-sender" />)

      fireEvent.change(screen.getByTestId('toUserId'), { target: { value: 'rec' } })
      fireEvent.change(screen.getByTestId('amountCents'), { target: { value: '50' } })

      const btn = screen.getByTestId('submit-btn') as HTMLButtonElement

      // click and wait for disabled state to be set
      fireEvent.click(btn)
      await waitFor(() => expect(btn.disabled).toBe(true))

      // resolve the transfer
      resolveTransfer({ transactionId: `tx-${Date.now()}` })

      // wait for completion
      await waitFor(() => screen.getByTestId('success'))
      expect(btn.disabled).toBe(false)
    } finally {
      spy.mockRestore()
      // restore original in case
      payClient.transfer = original
    }
  })
})
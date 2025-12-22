import React, { useState } from 'react'
import { useTransfer } from '@/hooks/api/useTransactions.new'
import type { TransferRequest } from '@/lib/paymentServiceClient'

interface TransferFormProps {
  defaultFromUserId?: string
  onSuccess?: (data: any) => void
}

export function TransferForm({ defaultFromUserId = '', onSuccess }: TransferFormProps) {
  const [fromUserId, setFromUserId] = useState<string>(defaultFromUserId)
  const [toUserId, setToUserId] = useState<string>('')
  const [amountCents, setAmountCents] = useState<number | ''>('')
  const [idempotencyKey, setIdempotencyKey] = useState<string>('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mutation = useTransfer()

  function validate(): boolean {
    if (!fromUserId) {
      setLocalError('Sender is required')
      return false
    }
    if (!toUserId) {
      setLocalError('Recipient is required')
      return false
    }
    if (!amountCents || amountCents <= 0) {
      setLocalError('Amount must be greater than zero')
      return false
    }
    setLocalError(null)
    return true
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!validate()) return

    const payload: TransferRequest = {
      fromUserId,
      toUserId,
      amountCents: Number(amountCents),
    }

    if (idempotencyKey.trim()) payload.idempotencyKey = idempotencyKey.trim()

    setIsSubmitting(true)
    try {
      const res = await mutation.mutateAsync(payload)
      setToUserId('')
      setAmountCents('')
      setIdempotencyKey('')
      if (onSuccess) onSuccess(res)
    } catch (err: any) {
      // error will be surfaced in UI via mutation.error as well
      // keep localError for immediate display
      const message = err?.response?.message || err?.message || 'Transfer failed'
      setLocalError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} data-testid="transfer-form">
      <div>
        <label>From (userId)</label>
        <input value={fromUserId} onChange={(e) => setFromUserId(e.target.value)} data-testid="fromUserId" />
      </div>

      <div>
        <label>To (userId)</label>
        <input value={toUserId} onChange={(e) => setToUserId(e.target.value)} data-testid="toUserId" />
      </div>

      <div>
        <label>Amount (cents)</label>
        <input
          type="number"
          value={amountCents as any}
          onChange={(e) => setAmountCents(e.target.value === '' ? '' : Number(e.target.value))}
          data-testid="amountCents"
        />
      </div>

      <div>
        <label>Idempotency Key (optional)</label>
        <input value={idempotencyKey} onChange={(e) => setIdempotencyKey(e.target.value)} data-testid="idempotencyKey" />
      </div>

      {localError && <div data-testid="local-error" style={{ color: 'red' }}>{localError}</div>}
      {mutation.isError && <div data-testid="api-error" style={{ color: 'red' }}>{(mutation.error as any)?.response?.message || (mutation.error as any)?.message}</div>}
      {mutation.isSuccess && <div data-testid="success">Transaction { (mutation.data as any)?.transactionId } created</div>}

      <button disabled={mutation.status === 'pending' || isSubmitting} type="submit" data-testid="submit-btn">
        {mutation.status === 'pending' || isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}

export default TransferForm

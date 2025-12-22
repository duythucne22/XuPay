// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMyLimits, useMyDailyUsage, useCheckLimit } from '../useLimits.new';
import { setDefaultUserServiceClient } from '@/lib/userServiceClient';
import MockUserServiceClient from '@/lib/mockUserClient';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('Limits Hooks', () => {
  beforeEach(() => {
    setDefaultUserServiceClient(new MockUserServiceClient());
  });

  describe('useMyLimits', () => {
    it('fetches user transaction limits', async () => {
      const { result } = renderHook(() => useMyLimits(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const limits = result.current.data;
      expect(limits?.kycTier).toBeDefined();
      expect(limits?.dailySendLimitCents).toBeGreaterThanOrEqual(0);
      expect(limits?.dailyReceiveLimitCents).toBeGreaterThanOrEqual(0);
      expect(limits?.maxTransactionsPerDay).toBeGreaterThanOrEqual(0);
    });

    it('returns all limit fields', async () => {
      const { result } = renderHook(() => useMyLimits(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const limits = result.current.data;
      expect(limits?.singleTransactionMaxCents).toBeGreaterThanOrEqual(0);
      expect(limits?.monthlyVolumeLimitCents).toBeGreaterThanOrEqual(0);
      expect(limits?.maxTransactionsPerHour).toBeGreaterThanOrEqual(0);
      expect(limits?.canSendInternational).toBeDefined();
      expect(limits?.canReceiveMerchantPayments).toBeDefined();
    });
  });

  describe('useMyDailyUsage', () => {
    it('fetches daily usage statistics', async () => {
      const { result } = renderHook(() => useMyDailyUsage(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const usage = result.current.data;
      expect(usage?.userId).toBeDefined();
      expect(usage?.usageDate).toBeDefined();
      expect(usage?.totalSentCents).toBeGreaterThanOrEqual(0);
      expect(usage?.totalSentCount).toBeGreaterThanOrEqual(0);
    });

    it('returns sent and received counts', async () => {
      const { result } = renderHook(() => useMyDailyUsage(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const usage = result.current.data;
      expect(usage?.totalReceivedCents).toBeGreaterThanOrEqual(0);
      expect(usage?.totalReceivedCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('useCheckLimit', () => {
    it('checks if user can perform transfer', async () => {
      const { result } = renderHook(() => useCheckLimit(), { wrapper: createWrapper() });

      result.current.mutate({
        amountCents: 10000,
        type: 'send',
      });

      await waitFor(() => {
        if (result.current.isError) {
          throw new Error(`Mutation failed: ${(result.current.error as any)?.message || 'Unknown error'}`);
        }
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.allowed).toBeDefined();
    });

    it('returns allowed status', async () => {
      const { result } = renderHook(() => useCheckLimit(), { wrapper: createWrapper() });

      result.current.mutate({
        amountCents: 5000,
        type: 'receive',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const response = result.current.data;
      expect(response?.allowed).toBe(true);
    });
  });
});

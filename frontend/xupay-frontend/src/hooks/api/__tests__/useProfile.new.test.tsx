// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMyProfile, useUpdateProfile } from '../useProfile.new';
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

describe('Profile Hooks', () => {
  beforeEach(() => {
    setDefaultUserServiceClient(new MockUserServiceClient());
  });

  describe('useMyProfile', () => {
    it('fetches current user profile', async () => {
      const { result } = renderHook(() => useMyProfile(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.id).toBeDefined();
      expect(result.current.data?.email).toBeDefined();
      expect(result.current.data?.firstName).toBeDefined();
    });

    it('returns profile response with all fields', async () => {
      const { result } = renderHook(() => useMyProfile(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const profile = result.current.data;
      expect(profile?.kycStatus).toBeDefined();
      expect(profile?.kycTier).toBeDefined();
      expect(profile?.isActive).toBeDefined();
      expect(profile?.isSuspended).toBeDefined();
      expect(profile?.fraudScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe('useUpdateProfile', () => {
    it('updates user profile', async () => {
      const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

      expect(result.current.isPending).toBe(false);

      result.current.mutate({
        firstName: 'Jane',
        lastName: 'Doe',
      });

      await waitFor(() => {
        if (result.current.isError) {
          throw new Error(`Mutation failed: ${(result.current.error as any)?.message || 'Unknown error'}`);
        }
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.firstName).toBe('Jane');
    });

    it('handles update with all profile fields', async () => {
      const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

      result.current.mutate({
        firstName: 'John',
        lastName: 'Smith',
        phone: '+84901234567',
        dateOfBirth: '1990-01-01',
        nationality: 'VNM',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
    });
  });
});

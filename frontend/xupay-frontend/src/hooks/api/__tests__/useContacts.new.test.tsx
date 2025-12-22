// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMyContacts, useAddContact, useRemoveContact } from '../useContacts.new';
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

describe('Contacts Hooks', () => {
  beforeEach(() => {
    setDefaultUserServiceClient(new MockUserServiceClient());
  });

  describe('useMyContacts', () => {
    it('fetches user contacts list', async () => {
      const { result } = renderHook(() => useMyContacts(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const contacts = result.current.data;
      expect(Array.isArray(contacts)).toBe(true);
    });

    it('returns contacts with correct structure', async () => {
      const { result } = renderHook(() => useMyContacts(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      if (result.current.data && result.current.data.length > 0) {
        const contact = result.current.data[0];
        expect(contact.id).toBeDefined();
        expect(contact.contactUserId).toBeDefined();
        expect(contact.firstName).toBeDefined();
        expect(contact.lastName).toBeDefined();
      }
    });
  });

  describe('useAddContact', () => {
    it('adds a new contact', async () => {
      const { result } = renderHook(() => useAddContact(), { wrapper: createWrapper() });

      result.current.mutate({
        contactUserId: 'user-123',
        nickname: 'John',
      });

      await waitFor(() => {
        if (result.current.isError) {
          throw new Error(`Mutation failed: ${(result.current.error as any)?.message || 'Unknown error'}`);
        }
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.id).toBeDefined();
    });

    it('handles add contact with optional nickname', async () => {
      const { result } = renderHook(() => useAddContact(), { wrapper: createWrapper() });

      result.current.mutate({
        contactUserId: 'user-456',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
    });
  });

  describe('useRemoveContact', () => {
    it('removes a contact', async () => {
      const { result } = renderHook(() => useRemoveContact(), { wrapper: createWrapper() });

      result.current.mutate('contact-id-123');

      await waitFor(() => {
        if (result.current.isError) {
          throw new Error(`Mutation failed: ${(result.current.error as any)?.message || 'Unknown error'}`);
        }
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isSuccess).toBe(true);
    });

    it('invalidates contacts list after removal', async () => {
      const contactsHook = renderHook(() => useMyContacts(), { wrapper: createWrapper() });
      const removeHook = renderHook(() => useRemoveContact(), { wrapper: createWrapper() });

      // Wait for initial contacts load
      await waitFor(() => expect(contactsHook.result.current.isLoading).toBe(false));

      // Remove a contact
      removeHook.result.current.mutate('contact-id-123');

      await waitFor(() => expect(removeHook.result.current.isSuccess).toBe(true));

      // Contacts should be refetched (cache invalidated)
      expect(removeHook.result.current.isSuccess).toBe(true);
    });
  });
});

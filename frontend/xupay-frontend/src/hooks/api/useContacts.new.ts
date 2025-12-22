/* ============================================
   CONTACTS HOOKS (NEW) - Using userServiceClient
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserServiceClient } from '@/lib/userServiceClient';
import type { AddContactRequest } from '@/lib/userServiceClient';

// ============================================================
// QUERY KEYS
// ============================================================

export const contactsKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactsKeys.all, 'list'] as const,
};

// ============================================================
// QUERIES
// ============================================================

/**
 * Get all contacts for current user
 */
export function useMyContacts() {
  const client = getUserServiceClient();

  return useQuery({
    queryKey: contactsKeys.lists(),
    queryFn: () => client.getMyContacts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================
// MUTATIONS
// ============================================================

/**
 * Add a new contact
 */
export function useAddContact() {
  const queryClient = useQueryClient();
  const client = getUserServiceClient();

  return useMutation({
    mutationFn: (request: AddContactRequest) => client.addContact(request),
    onSuccess: () => {
      // Invalidate contacts list to refresh
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() });
    },
  });
}

/**
 * Remove a contact
 */
export function useRemoveContact() {
  const queryClient = useQueryClient();
  const client = getUserServiceClient();

  return useMutation({
    mutationFn: (contactId: string) => client.removeContact(contactId),
    onSuccess: () => {
      // Invalidate contacts list to refresh
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() });
    },
  });
}

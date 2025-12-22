/* ============================================
   PROFILE HOOKS (NEW) - Using userServiceClient
   ============================================ */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserServiceClient } from '@/lib/userServiceClient';
import type { UpdateProfileRequest } from '@/lib/userServiceClient';

// ============================================================
// QUERY KEYS
// ============================================================

export const profileKeys = {
  all: ['profile'] as const,
  my: () => [...profileKeys.all, 'my'] as const,
};

// ============================================================
// QUERIES
// ============================================================

/**
 * Get current user profile
 */
export function useMyProfile() {
  const client = getUserServiceClient();

  return useQuery({
    queryKey: profileKeys.my(),
    queryFn: () => client.getMyProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================================
// MUTATIONS
// ============================================================

/**
 * Update current user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const client = getUserServiceClient();

  return useMutation({
    mutationFn: (request: UpdateProfileRequest) => client.updateMyProfile(request),
    onSuccess: (data) => {
      // Update cached profile
      queryClient.setQueryData(profileKeys.my(), data);
    },
  });
}

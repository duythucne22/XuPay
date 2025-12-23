'use client'

import { useQuery, UseQueryResult } from '@tanstack/react-query'

/**
 * PHASE 1 PR 6: Audit Log Hooks
 * 
 * For new Audit page (/app/audit)
 */

export interface AuditLogEntry {
  id: string
  timestamp: string
  action: string
  actor: string
  resource: string
  resourceId: string
  details?: string
  status: 'success' | 'failed'
  ipAddress?: string
}

export interface AuditLogResponse {
  data: AuditLogEntry[]
  total: number
  limit: number
  offset: number
}

export const auditKeys = {
  all: ['audit'] as const,
  logs: () => [...auditKeys.all, 'logs'] as const,
  log: (params: Record<string, unknown>) => [...auditKeys.logs(), params] as const,
}

interface UseAuditLogParams {
  limit?: number
  offset?: number
  action?: string
  actor?: string
  status?: 'success' | 'failed'
}

/**
 * Fetch audit log entries
 */
export function useAuditLog(
  params: UseAuditLogParams = {}
): UseQueryResult<AuditLogResponse, Error> {
  const { limit = 50, offset = 0, action, actor, status } = params

  return useQuery({
    queryKey: auditKeys.log({ limit, offset, action, actor, status }),
    queryFn: async () => {
      // Mock audit log data
      const mockEntries: AuditLogEntry[] = Array.from({ length: limit }, (_, i) => ({
        id: `audit-${offset + i + 1}`,
        timestamp: new Date(Date.now() - (offset + i) * 60000).toISOString(),
        action: ['login', 'create', 'update', 'delete', 'transfer', 'freeze_wallet'][
          Math.floor(Math.random() * 6)
        ],
        actor: `user_${Math.floor(Math.random() * 1000)}`,
        resource: ['wallet', 'transaction', 'user', 'payment'][
          Math.floor(Math.random() * 4)
        ],
        resourceId: `res-${Math.random().toString(36).substring(7)}`,
        details: 'Operation completed successfully',
        status: Math.random() > 0.1 ? 'success' : 'failed',
        ipAddress: `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      }))

      // Apply filters
      let filtered = mockEntries
      if (action) filtered = filtered.filter((e) => e.action === action)
      if (actor) filtered = filtered.filter((e) => e.actor === actor)
      if (status) filtered = filtered.filter((e) => e.status === status)

      return {
        data: filtered,
        total: 10000, // Mock total count
        limit,
        offset,
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

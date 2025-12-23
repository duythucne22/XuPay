/* ============================================
   API HOOKS BARREL EXPORT
   Layer 4: All React Query hooks
   ============================================ */

// Auth hooks
export {
  authKeys,
  useCurrentUser,
  useSessions,
  useLogin,
  useRegister,
  useLogout,
  useChangePassword,
  useRefreshToken,
  useRevokeSession,
  useRevokeAllSessions,
} from './useAuth'

// Users hooks
export {
  usersKeys,
  useUsers,
  useUser,
  useUpdateUser,
  useUpdateKyc,
  useSuspendUser,
  useReactivateUser,
  useDeleteUser,
} from './useUsers'

// Wallets hooks
export {
  walletsKeys,
  useWallets,
  useWallet,
  useUserWallets,
  useMyWallets,
  useWalletBalance,
  usePlatformBalance,
  useFreezeWallet,
  useUnfreezeWallet,
} from './useWallets'

// Transactions hooks
export {
  transactionsKeys,
  useTransactions,
  useTransaction,
  useMyTransactions,
  useWalletTransactions,
  useTransactionStats,
  useTransfer,
  useDeposit,
  useWithdraw,
} from './useTransactions'

// SAR hooks
export {
  sarKeys,
  useSars,
  useSar,
  useSarStats,
  useCreateSar,
  useUpdateSar,
  useAssignSar,
  useStartSarReview,
  useFileSar,
  useDismissSar,
} from './useSars'

// Dashboard hooks (PHASE 1 PR 6)
export {
  dashboardKeys,
  useDashboardOverview,
  type DashboardKPI,
  type DashboardChartData,
  type DashboardTransaction,
  type DashboardOverview,
} from './useDashboard'

// Analytics hooks (PHASE 1 PR 6)
export {
  analyticsKeys,
  useAnalyticsOverview,
  type AnalyticsKPI,
  type AnalyticsChartData,
  type AnalyticsData,
} from './useAnalytics'

// Audit hooks (PHASE 1 PR 6)
export {
  auditKeys,
  useAuditLog,
  type AuditLogEntry,
  type AuditLogResponse,
} from './useAuditLog'

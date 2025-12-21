/* ============================================
   API BARREL EXPORT
   Layer 2: All API modules
   ============================================ */

// Base client and utilities
export { ApiError, tokenStorage, userServiceClient, paymentServiceClient } from './client'

// Domain-specific APIs
export { authApi } from './auth'
export { usersApi } from './users'
export { walletsApi } from './wallets'
export { transactionsApi } from './transactions'
export { sarApi } from './sar'

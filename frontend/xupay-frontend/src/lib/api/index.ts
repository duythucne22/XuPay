import { getUserServiceClient } from '@/lib/userServiceClient';
import { getPaymentServiceClient } from '@/lib/paymentServiceClient';
import type {
  PaginatedDTO,
  WalletDTO,
  TransactionDTO,
  SARDTO,
  UserDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  UpdateUserRequestDTO,
  CreateWalletRequestDTO,
  TransferRequestDTO,
} from '@/types/api';
import type { UserResponse, ProfileResponse, UserLimitsResponse, DailyUsageResponse, ContactResponse, CheckLimitRequest, AddContactRequest } from '@/lib/userServiceClient';
import type { TransferRequest, WalletBalanceResponse, CreateWalletRequest, FreezeWalletRequest } from '@/lib/paymentServiceClient';

// Helper to create paginated DTOs compatible with adapters
function makePaginated<T>(content: T[], page = 0, size = 20): PaginatedDTO<T> {
  const totalElements = content.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  return {
    content,
    totalElements,
    totalPages,
    page,
    size,
    first: page === 0,
    last: page + 1 >= totalPages,
  } as PaginatedDTO<T>;
}

// Token storage (legacy API compatibility)
export const tokenStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken') || null;
  },
  getAccessToken(): string | null {
    return this.getToken();
  },
  setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  },
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
  },
  clearTokens() {
    this.clear();
  },
};

// AUTH API compatibility
export const authApi = {
  register: (req: RegisterRequestDTO) => getUserServiceClient().register({
    email: req.email,
    password: req.password,
    firstName: req.firstName,
    lastName: req.lastName,
    phone: req.phoneNumber,
  }),
  login: (req: LoginRequestDTO) => getUserServiceClient().login(req),
  logout: async () => {
    await getUserServiceClient().logout();
    tokenStorage.clear(); // Also clear shared token storage
  },
  validate: () => getUserServiceClient().validateToken(),
  me: () => getUserServiceClient().getCurrentUser(),
  getCurrentUser: async (): Promise<UserDTO> => {
    const dto = await getUserServiceClient().getCurrentUser();
    // Map UserResponse -> UserDTO
    return {
      id: dto.id,
      email: dto.email,
      phone: dto.phone,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: undefined,
      nationality: undefined,
      kycStatus: dto.kycStatus,
      kycTier: dto.kycTier,
      kycVerifiedAt: undefined,
      isActive: dto.isActive,
      isSuspended: false,
      suspensionReason: undefined,
      fraudScore: 0,
      createdAt: dto.createdAt,
      updatedAt: new Date().toISOString(),
      lastLoginAt: undefined,
    };
  },
  getSessions: async () => [],
  changePassword: async (_data: unknown) => ({}),
  refreshToken: async () => ({ accessToken: tokenStorage.getToken() || '', expiresAt: new Date().toISOString() }),
  revokeSession: async (_sessionId: string) => {},
  revokeAllSessions: async () => {},
};

// USERS API compatibility (admin + user endpoints)
export const usersApi = {
  getMyProfile: (): Promise<ProfileResponse> => getUserServiceClient().getMyProfile(),
  updateMyProfile: (req: UpdateUserRequestDTO): Promise<ProfileResponse> => 
    getUserServiceClient().updateMyProfile({
      firstName: req.firstName,
      lastName: req.lastName,
      phone: req.phone,
      dateOfBirth: req.dateOfBirth,
      nationality: req.nationality,
    }),
  getMyLimits: (): Promise<UserLimitsResponse> => getUserServiceClient().getMyLimits(),
  getMyDailyUsage: (): Promise<DailyUsageResponse> => getUserServiceClient().getMyDailyUsage(),
  checkLimit: (req: CheckLimitRequest): Promise<any> => getUserServiceClient().checkLimit(req),
  getContacts: (): Promise<ContactResponse[]> => getUserServiceClient().getMyContacts(),
  addContact: (req: AddContactRequest): Promise<ContactResponse> => getUserServiceClient().addContact(req),
  removeContact: (id: string): Promise<void> => getUserServiceClient().removeContact(id),

  // Admin-style endpoints (stubs for now)
  getUsers: async (params: { page?: number; size?: number } = {}): Promise<PaginatedDTO<UserDTO>> => 
    makePaginated<UserDTO>([], params.page, params.size),
  getUserById: async (id: string): Promise<UserDTO> => ({ 
    id, 
    email: 'user@example.com',
    firstName: '',
    lastName: '',
    kycStatus: 'PENDING',
    kycTier: 'TIER_0',
    isActive: true,
    isSuspended: false,
    fraudScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  updateUser: async (_id: string, _data: unknown): Promise<unknown> => ({}),
  updateKyc: async (_id: string, _data: unknown): Promise<unknown> => ({}),
  suspendUser: async (_id: string, _reason: unknown): Promise<unknown> => ({}),
  reactivateUser: async (_id: string): Promise<unknown> => ({}),
  deleteUser: async (_id: string): Promise<unknown> => ({}),
};

// TRANSACTIONS API compatibility
export const transactionsApi = {
  getTransactions: async (params: { page?: number; size?: number; userId?: string } = {}): Promise<PaginatedDTO<TransactionDTO>> => {
    const res = await getPaymentServiceClient().listTransactions(params);
    // Map TransactionDetailResponse -> TransactionDTO
    const content: TransactionDTO[] = res.items.map((tx: any) => ({
      id: tx.transactionId || '',
      idempotencyKey: tx.idempotencyKey || '',
      fromWalletId: tx.fromWalletId,
      toWalletId: tx.toWalletId,
      fromUserId: tx.fromUserId,
      toUserId: tx.toUserId,
      amountCents: tx.amountCents,
      currency: tx.currency || 'VND',
      type: 'TRANSFER' as const,
      status: (tx.status as any) || 'PROCESSING',
      description: tx.description,
      referenceNumber: undefined,
      isFlagged: false,
      fraudScore: 0,
      isReversed: false,
      createdAt: tx.createdAt || new Date().toISOString(),
    }));
    return makePaginated<TransactionDTO>(content, params.page, params.size);
  },
  getTransactionById: async (id: string): Promise<TransactionDTO> => {
    const tx = await getPaymentServiceClient().getTransaction(id);
    return {
      id: tx.transactionId || '',
      idempotencyKey: '',
      fromWalletId: undefined,
      toWalletId: undefined,
      fromUserId: undefined,
      toUserId: undefined,
      amountCents: tx.amountCents,
      currency: tx.currency || 'VND',
      type: 'TRANSFER' as const,
      status: (tx.status as any) || 'PROCESSING',
      description: tx.description,
      referenceNumber: undefined,
      isFlagged: false,
      fraudScore: 0,
      isReversed: false,
      createdAt: tx.createdAt || new Date().toISOString(),
    };
  },
  getByIdempotencyKey: (key: string) => getPaymentServiceClient().getByIdempotencyKey(key),
  getMyTransactions: async (params: any = {}): Promise<PaginatedDTO<TransactionDTO>> => transactionsApi.getTransactions(params),
  getWalletTransactions: async (walletId: string, params: any = {}): Promise<PaginatedDTO<TransactionDTO>> => 
    transactionsApi.getTransactions({ ...params, walletId }),
  getStats: async (_period: string) => ({ totalTransactions: 0, totalVolumeCents: 0, completedCount: 0, pendingCount: 0, failedCount: 0, byType: {}, period: _period }),
  transfer: (req: TransferRequestDTO): Promise<any> => getPaymentServiceClient().transfer({
    idempotencyKey: req.idempotencyKey,
    fromUserId: req.fromUserId,
    toUserId: req.toUserId,
    amountCents: req.amountCents,
    description: req.description,
  }),
  createTransfer: (req: TransferRequestDTO): Promise<any> => getPaymentServiceClient().transfer({
    idempotencyKey: req.idempotencyKey,
    fromUserId: req.fromUserId,
    toUserId: req.toUserId,
    amountCents: req.amountCents,
    description: req.description,
  }),
  deposit: async (_req: unknown): Promise<unknown> => ({}),
  withdraw: async (_req: unknown): Promise<unknown> => ({}),
};

// WALLETS API compatibility
function balanceToWalletDTO(b: WalletBalanceResponse): WalletDTO {
  return {
    id: b.walletId || `wallet-${Math.random().toString(36).slice(2, 8)}`,
    userId: b.userId || 'unknown',
    glAccountCode: 'GL-000',
    walletType: 'PERSONAL',
    currency: b.currency || 'VND',
    isActive: b.isActive ?? true,
    isFrozen: b.isFrozen ?? false,
    freezeReason: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const walletsApi = {
  getWallets: async (params: { page?: number; size?: number } = {}): Promise<PaginatedDTO<WalletDTO>> => {
    const wallets: WalletDTO[] = [];
    return makePaginated<WalletDTO>(wallets, params.page, params.size);
  },
  getWalletById: async (id: string): Promise<WalletDTO> => {
    const b = await getPaymentServiceClient().getWalletBalance(id);
    return balanceToWalletDTO(b);
  },
  getWalletsByUserId: async (userId: string): Promise<WalletDTO[]> => {
    const w = await getPaymentServiceClient().getWalletByUserId(userId);
    return [balanceToWalletDTO(w as any)];
  },
  getMyWallets: async (): Promise<WalletDTO[]> => {
    const user = await getUserServiceClient().getCurrentUser();
    const w = await getPaymentServiceClient().getWalletByUserId(user.id);
    return [balanceToWalletDTO(w as any)];
  },
  getWalletBalance: (walletId: string): Promise<WalletBalanceResponse> => getPaymentServiceClient().getWalletBalance(walletId),
  getPlatformBalance: async () => ({ balanceCents: 0, currency: 'VND' }),
  freezeWallet: (walletId: string, reasonOrPayload: { reason?: string } | string): Promise<any> =>
    getPaymentServiceClient().freezeWallet(walletId, { 
      freeze: true, 
      reason: typeof reasonOrPayload === 'string' ? reasonOrPayload : (reasonOrPayload?.reason || '')
    }),
  unfreezeWallet: (walletId: string): Promise<any> => getPaymentServiceClient().freezeWallet(walletId, { freeze: false }),
};

// SAR API compatibility
export const sarApi = {
  getSars: async (params: any = {}) => makePaginated<SARDTO>([], params.page, params.size),
  getSarById: async (_id: string) => ({} as SARDTO),
  getStats: async () => ({}),
  createSar: async (_data: any) => ({}),
  updateSar: async (_id: string, _data: any) => ({}),
  assignSar: async (_id: string, _analystId: string) => ({}),
  startReview: async (_id: string) => ({}),
  fileSar: async (_id: string, _notes: string) => ({}),
  dismissSar: async (_id: string, _reason: string) => ({}),
};

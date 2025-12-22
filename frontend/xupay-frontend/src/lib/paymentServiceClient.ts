// ============================================================
// PAYMENT SERVICE TYPESCRIPT API CLIENT
// Auto-generated helper for frontend integration (hand-authored)
// Backend verified: 2025-12-21
// ============================================================

import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig // [FIX] Changed from AxiosRequestConfig
} from 'axios';

// ============================================================
// Config
// ============================================================
export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  onError?: (err: ApiError) => void;
}

const DEFAULT_CONFIG: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://localhost:8082',
  timeout: 30000,
};

// ============================================================
// Types / DTOs
// ============================================================
export type TransactionStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'BLOCKED' | 'REVIEW';
export type WalletType = 'PERSONAL' | 'MERCHANT' | 'ESCROW';

export interface TransferRequest {
  idempotencyKey?: string; // optional; will also be sent as X-Idempotency-Key header if provided
  fromUserId: string; // UUID
  toUserId: string; // UUID
  amountCents: number;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface TransferResponse {
  transactionId: string;
  idempotencyKey?: string;
  fromUserId: string;
  toUserId: string;
  amountCents: number;
  amount?: number; // optional human amount
  currency?: string;
  status: TransactionStatus;
  createdAt?: string;
}

export interface TransactionDetailResponse {
  transactionId: string;
  type: string;
  status: string;
  amountCents: number;
  currency: string;
  description?: string;
  createdAt?: string;
}

export interface CreateWalletRequest {
  userId: string;
  walletType: WalletType;
  currency: string;
}

export interface CreateWalletResponse {
  walletId: string;
  userId: string;
  glAccountCode?: string;
  walletType: WalletType;
  currency: string;
  balanceCents: number;
  isActive: boolean;
  createdAt?: string;
}

export interface WalletBalanceResponse {
  walletId: string;
  userId: string;
  balanceCents: number;
  balanceAmount?: number;
  currency: string;
  isActive: boolean;
  isFrozen: boolean;
}

export interface FreezeWalletRequest {
  freeze: boolean;
  reason?: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  timestamp?: string;
}

export class ApiError extends Error {
  constructor(public statusCode: number, public code: string, message: string, public response?: ErrorResponse) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================
// Client
// ============================================================
export class PaymentServiceClient implements IPaymentServiceClient {
  private client: AxiosInstance;
  private config: ApiConfig;

  constructor(config: ApiConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: { 'Content-Type': 'application/json' },
    });
 
    // Attach token automatically if present in localStorage
    this.client.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
      try {
        const token = this.getToken();
        if (token) {
          const headers: any = cfg.headers || {};
          if (typeof headers.set === 'function') {
            headers.set('Authorization', `Bearer ${token}`);
          } else {
            headers['Authorization'] = `Bearer ${token}`;
            cfg.headers = headers;
          }
        }
      } catch (e) {
        // don't let header-setting break requests
        // eslint-disable-next-line no-console
        console.warn('[PaymentServiceClient] failed to set auth header', e);
      }
      return cfg;
    });
 
    // Standardized error handling
    this.client.interceptors.response.use(
      (r) => r,
      (err: AxiosError<ErrorResponse>) => {
        let apiError: ApiError;
        if (err.response) {
          apiError = new ApiError(
            err.response.status,
            err.response.data?.code || 'UNKNOWN_ERROR',
            err.response.data?.message || err.message,
            err.response.data
          );
        } else {
          apiError = new ApiError(
            0,
            (err.code as string) || 'NETWORK_ERROR',
            err.message,
            undefined
          );
        }
 
        if (this.config.onError) this.config.onError(apiError);
        return Promise.reject(apiError);
      }
    );
  }

  // ---------------------- token helpers ----------------------
  private getToken(): string | null {
    if (typeof window !== 'undefined') return localStorage.getItem('accessToken');
    return null;
  }

  public setToken(token: string): void {
    if (typeof window !== 'undefined') localStorage.setItem('accessToken', token);
  }

  public clearToken(): void {
    if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
  }

  // ---------------------- Transactions -----------------------

  async transfer(request: TransferRequest): Promise<TransferResponse> {
    const headers: Record<string,string> = {};
    if (request.idempotencyKey) headers['X-Idempotency-Key'] = request.idempotencyKey;

    const resp = await this.client.post<TransferResponse>('/api/payments/transfer', request, { headers });
    return resp.data;
  }

  async getTransaction(transactionId: string): Promise<TransactionDetailResponse> {
    const resp = await this.client.get<TransactionDetailResponse>(`/api/payments/${transactionId}`);
    return resp.data;
  }

  async getByIdempotencyKey(idempotencyKey: string): Promise<TransferResponse | null> {
    try {
      const resp = await this.client.get<TransferResponse>(`/api/payments/idempotency/${idempotencyKey}`);
      return resp.data;
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 404) return null;
      throw e;
    }
  }

  async listTransactions(params: { userId?: string; page?: number; size?: number } = {}): Promise<{ items: TransactionDetailResponse[]; total?: number }> {
    const resp = await this.client.get<{ items: TransactionDetailResponse[]; total?: number }>('/api/payments', { params });
    return resp.data;
  }

  // ------------------------- Wallets -------------------------

  async createWallet(request: CreateWalletRequest): Promise<CreateWalletResponse> {
    const resp = await this.client.post<CreateWalletResponse>('/api/wallets', request);
    return resp.data;
  }

  async getWalletByUserId(userId: string): Promise<WalletBalanceResponse> {
    const resp = await this.client.get<WalletBalanceResponse>(`/api/wallets/user/${userId}`);
    return resp.data;
  }

  async getWalletBalance(walletId: string): Promise<WalletBalanceResponse> {
    const resp = await this.client.get<WalletBalanceResponse>(`/api/wallets/${walletId}/balance`);
    return resp.data;
  }

  async freezeWallet(walletId: string, request: FreezeWalletRequest): Promise<void> {
    await this.client.put(`/api/wallets/${walletId}/freeze`, request);
  }
}

// ============================================================
// CLIENT INTERFACE (for mock swapping)
// ============================================================

export interface IPaymentServiceClient {
  transfer(request: TransferRequest): Promise<TransferResponse>;
  getTransaction(transactionId: string): Promise<TransactionDetailResponse>;
  getByIdempotencyKey(idempotencyKey: string): Promise<TransferResponse | null>;
  listTransactions(params?: { userId?: string; page?: number; size?: number }): Promise<{ items: TransactionDetailResponse[]; total?: number }>;
  createWallet(request: CreateWalletRequest): Promise<CreateWalletResponse>;
  getWalletByUserId(userId: string): Promise<WalletBalanceResponse>;
  getWalletBalance(walletId: string): Promise<WalletBalanceResponse>;
  freezeWallet(walletId: string, request: FreezeWalletRequest): Promise<void>;
  setToken(token: string): void;
  clearToken(): void;
}

// ============================================================
// Default singleton with mock support
// ============================================================

let defaultClient: IPaymentServiceClient | null = null;

export function setDefaultPaymentServiceClient(client: IPaymentServiceClient | null): void {
  defaultClient = client;
}

export function getPaymentServiceClient(config?: ApiConfig): IPaymentServiceClient {
  // Return existing client if set
  if (defaultClient) return defaultClient;

  // Check if we should use mocks
  const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
  
  if (useMocks) {
    // Lazy load mock client to avoid bundling in production
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MockPaymentServiceClient } = require('./mockPaymentClient');
    defaultClient = new MockPaymentServiceClient();
  } else {
    defaultClient = new PaymentServiceClient(config);
  }
  
  // [FIX] Added non-null assertion (!) to guarantee return type matches interface
  return defaultClient!;
}

export default PaymentServiceClient;

/*
Example React hooks (optional):

import { useMutation, useQuery } from '@tanstack/react-query';

export function useTransfer() {
  const client = getPaymentServiceClient();
  return useMutation((req: TransferRequest) => client.transfer(req));
}

export function useWallet(userId: string) {
  const client = getPaymentServiceClient();
  return useQuery(['wallet', userId], () => client.getWalletByUserId(userId));
}

Notes:
- Use `idempotencyKey` for safe retries; also set `X-Idempotency-Key` header when calling `transfer()`.
- For sensitive environments prefer storing tokens in secure HTTP-only cookies and adjust interceptors.
*/
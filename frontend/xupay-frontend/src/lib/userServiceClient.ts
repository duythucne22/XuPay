// ============================================================
// USER SERVICE TYPESCRIPT API CLIENT
// Auto-generated from User Service REST API
// Backend Verified: 2025-12-21
// ============================================================

import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig // [FIX] Changed from AxiosRequestConfig
} from 'axios';

// ============================================================
// CONFIGURATION
// ============================================================

export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  onTokenRefresh?: () => Promise<string>;
  onError?: (error: ApiError) => void;
}

const DEFAULT_CONFIG: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8081',
  timeout: 30000,
};

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
export type KycTier = 'TIER_0' | 'TIER_1' | 'TIER_2' | 'TIER_3';
export type DocumentType = 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID' | 'UTILITY_BILL' | 'SELFIE';

// [CRITICAL UPDATE] Backend expects lowercase for transaction types
export type TransactionType = 'send' | 'receive'; 

// ============================================================
// REQUEST DTOs
// ============================================================

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string; // Must be E.164 format (e.g., +84901234567)
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string; // Must be E.164 format (e.g., +84901234567)
  dateOfBirth?: string; // Format: YYYY-MM-DD
  nationality?: string; // ISO 3166-1 alpha-3 (USA, VNM, etc.)
}

export interface AddContactRequest {
  contactUserId: string;
  nickname?: string;
}

export interface CheckLimitRequest {
  amountCents: number;
  type: TransactionType;
}

export interface UploadKycDocumentRequest {
  documentType: DocumentType;
  documentNumber?: string;
  documentCountry?: string;
  fileUrl: string; // S3 URL or pre-signed URL
}

export interface ApproveKycRequest {
  notes?: string;
}

export interface RejectKycRequest {
  reason: string;
}

// ============================================================
// RESPONSE DTOs
// ============================================================

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  kycStatus: KycStatus;
  kycTier: KycTier;
  isActive: boolean;
  createdAt: string; // ISO 8601
}

export interface AuthResponse {
  accessToken: string;
  expiresAt: string; // ISO 8601
  user: UserResponse; // Flattened user object returned by login
  userId?: string;    // Sometimes returned separately
}

export interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  kycStatus: KycStatus;
  kycTier: KycTier;
  isActive: boolean;
  isSuspended: boolean;
  fraudScore: number;
  createdAt: string;
}

export interface UserLimitsResponse {
  kycTier: KycTier;
  dailySendLimitCents: number;
  dailyReceiveLimitCents: number;
  singleTransactionMaxCents: number;
  monthlyVolumeLimitCents: number;
  maxTransactionsPerDay: number;
  maxTransactionsPerHour: number;
  canSendInternational: boolean;
  canReceiveMerchantPayments: boolean;
}

export interface DailyUsageResponse {
  userId: string;
  usageDate: string;
  totalSentCents: number;
  totalSentCount: number;
  totalReceivedCents: number;
  totalReceivedCount: number;
  hourlySentCounts?: Record<string, number>;
}

export interface LimitCheckResponse {
  allowed: boolean;
  reason?: string;
  remainingDailyCents?: number;
}

export interface ContactResponse {
  id: string;
  contactUserId: string;
  email: string; // Often null in response depending on privacy settings
  firstName: string;
  lastName: string;
  nickname?: string;
  totalTransactions: number;
  lastTransactionAt?: string;
  isFavorite: boolean;
}

export interface KycDocumentResponse {
  id: string;
  userId: string;
  documentType: DocumentType;
  documentNumber?: string;
  documentCountry?: string;
  fileUrl: string;
  fileSizeBytes?: number;
  mimeType?: string;
  verificationStatus: string;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public response?: ErrorResponse
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================
// API CLIENT CLASS
// ============================================================

export class UserServiceClient implements IUserServiceClient {
  private client: AxiosInstance;
  private config: ApiConfig;

  constructor(config: ApiConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: Attach Token
    this.client.interceptors.request.use(
      // [FIX] Changed type to InternalAxiosRequestConfig
      (config: InternalAxiosRequestConfig) => {
        try {
          const token = this.getToken();
          if (token) {
            const headers: any = config.headers || {};
            if (typeof headers.set === 'function') {
              headers.set('Authorization', `Bearer ${token}`);
            } else {
              headers['Authorization'] = `Bearer ${token}`;
              config.headers = headers;
            }
          }
        } catch (e) {
          // don't let header-setting break requests
           
          console.warn('[UserServiceClient] failed to set auth header', e);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Error Handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ErrorResponse>) => {
        let apiError: ApiError;

        if (error.response) {
          apiError = new ApiError(
            error.response.status,
            error.response.data?.code || 'UNKNOWN_ERROR',
            error.response.data?.message || error.message,
            error.response.data
          );
        } else {
          // Network or unknown error -> normalize
          apiError = new ApiError(
            0,
            (error.code as string) || 'NETWORK_ERROR',
            error.message,
            undefined
          );
        }

        if (this.config.onError) this.config.onError(apiError);
        return Promise.reject(apiError);
      }
    );
  }

  // ============================================================
  // TOKEN MANAGEMENT
  // ============================================================

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
  }

  public setToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
    }
  }

  public clearToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
    }
  }

  // ============================================================
  // AUTHENTICATION ENDPOINTS
  // ============================================================

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/register', request);
    if (response.data.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return response.data;
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/auth/login', request);
    if (response.data.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    try {
        await this.client.post('/api/auth/logout');
    } catch (e) {
        // Ignore logout errors, just clear token
    }
    this.clearToken();
  }

  async validateToken(): Promise<{ valid: boolean }> {
    try {
      await this.client.get('/api/auth/validate');
      return { valid: true };
    } catch {
      return { valid: false };
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await this.client.get<UserResponse>('/api/auth/me');
    return response.data;
  }

  // ============================================================
  // USER PROFILE ENDPOINTS
  // ============================================================

  async getMyProfile(): Promise<ProfileResponse> {
    const response = await this.client.get<ProfileResponse>('/api/users/me/profile');
    return response.data;
  }

  async updateMyProfile(request: UpdateProfileRequest): Promise<ProfileResponse> {
    const response = await this.client.put<ProfileResponse>('/api/users/me/profile', request);
    return response.data;
  }

  // ============================================================
  // LIMITS & USAGE
  // ============================================================

  async getMyLimits(): Promise<UserLimitsResponse> {
    const response = await this.client.get<UserLimitsResponse>('/api/users/me/limits');
    return response.data;
  }

  async getMyDailyUsage(): Promise<DailyUsageResponse> {
    const response = await this.client.get<DailyUsageResponse>('/api/users/me/daily-usage');
    return response.data;
  }

  async checkLimit(request: CheckLimitRequest): Promise<LimitCheckResponse> {
    const response = await this.client.post<LimitCheckResponse>('/api/users/me/check-limit', request);
    return response.data;
  }

  // ============================================================
  // CONTACTS
  // ============================================================

  async getMyContacts(): Promise<ContactResponse[]> {
    const response = await this.client.get<ContactResponse[]>('/api/users/me/contacts');
    return response.data;
  }

  async addContact(request: AddContactRequest): Promise<ContactResponse> {
    const response = await this.client.post<ContactResponse>('/api/users/me/contacts', request);
    return response.data;
  }

  async removeContact(contactId: string): Promise<void> {
    await this.client.delete(`/api/users/me/contacts/${contactId}`);
  }

  // ============================================================
  // KYC
  // ============================================================

  async uploadKycDocument(request: UploadKycDocumentRequest): Promise<KycDocumentResponse> {
    const response = await this.client.post<KycDocumentResponse>('/api/kyc/upload-document', request);
    return response.data;
  }

  async getMyKycDocuments(): Promise<KycDocumentResponse[]> {
    const response = await this.client.get<KycDocumentResponse[]>('/api/kyc/documents');
    return response.data;
  }

  async getKycDocument(id: string): Promise<KycDocumentResponse> {
    const response = await this.client.get<KycDocumentResponse>(`/api/kyc/${id}`);
    return response.data;
  }

  // ADMIN ONLY
  async getPendingKycDocuments(): Promise<KycDocumentResponse[]> {
    const response = await this.client.get<KycDocumentResponse[]>('/api/kyc/pending');
    return response.data;
  }

  async approveKycDocument(id: string, request: ApproveKycRequest): Promise<KycDocumentResponse> {
    const response = await this.client.post<KycDocumentResponse>(`/api/kyc/${id}/approve`, request);
    return response.data;
  }

  async rejectKycDocument(id: string, request: RejectKycRequest): Promise<KycDocumentResponse> {
    const response = await this.client.post<KycDocumentResponse>(`/api/kyc/${id}/reject`, request);
    return response.data;
  }

  // Backwards-compatible aliases required by IUserServiceClient
  async getMyDocuments(): Promise<KycDocumentResponse[]> {
    return this.getMyKycDocuments();
  }

  async getDocumentById(id: string): Promise<KycDocumentResponse> {
    return this.getKycDocument(id);
  }
}

// ============================================================
// CLIENT INTERFACE (for mock swapping)
// ============================================================

export interface IUserServiceClient {
  register(request: RegisterRequest): Promise<AuthResponse>;
  login(request: LoginRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  validateToken(): Promise<{ valid: boolean }>;
  getCurrentUser(): Promise<UserResponse>;
  getMyProfile(): Promise<ProfileResponse>;
  updateMyProfile(request: UpdateProfileRequest): Promise<ProfileResponse>;
  getMyLimits(): Promise<UserLimitsResponse>;
  getMyDailyUsage(): Promise<DailyUsageResponse>;
  checkLimit(request: CheckLimitRequest): Promise<LimitCheckResponse>;
  getMyContacts(): Promise<ContactResponse[]>;
  addContact(request: AddContactRequest): Promise<ContactResponse>;
  removeContact(contactId: string): Promise<void>;
  uploadKycDocument(request: UploadKycDocumentRequest): Promise<KycDocumentResponse>;
  getMyDocuments(): Promise<KycDocumentResponse[]>;
  getDocumentById(id: string): Promise<KycDocumentResponse>;
  setToken(token: string): void;
  clearToken(): void;
}

// ============================================================
// EXPORT SINGLETON with mock support
// ============================================================

let defaultClient: IUserServiceClient | null = null;

export function setDefaultUserServiceClient(client: IUserServiceClient | null): void {
  defaultClient = client;
}

export function getUserServiceClient(config?: ApiConfig): IUserServiceClient {
  // Return existing client if set
  if (defaultClient) return defaultClient;

  // Check if we should use mocks
  const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
  
  if (useMocks) {
    // Lazy load mock client to avoid bundling in production
     
    const { MockUserServiceClient } = require('./mockUserClient');
    defaultClient = new MockUserServiceClient();
  } else {
    defaultClient = new UserServiceClient(config);
  }
  
  // [FIX] Added non-null assertion (!) because we know defaultClient is assigned above
  return defaultClient!;
}

export default UserServiceClient;
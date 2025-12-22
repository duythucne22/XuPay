// ============================================================
// MOCK USER SERVICE CLIENT
// In-memory client for development/testing without backend
// ============================================================

import type {
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
  AddContactRequest,
  CheckLimitRequest,
  UploadKycDocumentRequest,
  AuthResponse,
  UserResponse,
  ProfileResponse,
  UserLimitsResponse,
  DailyUsageResponse,
  LimitCheckResponse,
  ContactResponse,
  KycDocumentResponse,
  KycStatus,
  KycTier,
} from './userServiceClient';

// Simple in-memory stores
const mockUsers = new Map<string, ProfileResponse>();
const mockSessions = new Map<string, { token: string; userId: string; expiresAt: string }>();
const mockContacts = new Map<string, ContactResponse[]>();
const mockDocuments = new Map<string, KycDocumentResponse[]>();

let userCounter = 1000;
let contactCounter = 2000;
let documentCounter = 3000;

/**
 * MockUserServiceClient - implements same interface as UserServiceClient
 * Returns realistic mock data with simulated delays
 */
export class MockUserServiceClient {
  private delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateUserId(): string {
    return `user-mock-${userCounter++}-${Date.now()}`;
  }

  private generateToken(): string {
    return `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  private createMockUser(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    phone?: string
  ): ProfileResponse {
    return {
      id,
      email,
      firstName,
      lastName,
      phone,
      kycStatus: 'PENDING' as KycStatus,
      kycTier: 'TIER_0' as KycTier,
      isActive: true,
      isSuspended: false,
      fraudScore: 0,
      createdAt: new Date().toISOString(),
    };
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    await this.delay(500);

    const userId = this.generateUserId();
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    const user = this.createMockUser(
      userId,
      request.email,
      request.firstName,
      request.lastName,
      request.phone
    );

    mockUsers.set(userId, user);
    mockSessions.set(token, { token, userId, expiresAt });

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      kycStatus: user.kycStatus,
      kycTier: user.kycTier,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    return {
      accessToken: token,
      expiresAt,
      user: userResponse,
      userId,
    };
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    await this.delay(400);

    // Find user by email (mock)
    const existingUser = Array.from(mockUsers.values()).find((u) => u.email === request.email);

    let userId: string;
    let user: ProfileResponse;

    if (existingUser) {
      userId = existingUser.id;
      user = existingUser;
    } else {
      // Create a default mock user
      userId = this.generateUserId();
      user = this.createMockUser(userId, request.email, 'Mock', 'User');
      mockUsers.set(userId, user);
    }

    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + 3600000).toISOString();
    mockSessions.set(token, { token, userId, expiresAt });

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      kycStatus: user.kycStatus,
      kycTier: user.kycTier,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    return {
      accessToken: token,
      expiresAt,
      user: userResponse,
      userId,
    };
  }

  async logout(): Promise<void> {
    await this.delay(100);
    // Mock logout - clear token
    this.clearToken();
  }

  async validateToken(): Promise<{ valid: boolean }> {
    await this.delay(100);
    return { valid: true };
  }

  async getCurrentUser(): Promise<UserResponse> {
    await this.delay(200);

    // Return first user in mock store or create one
    const user = mockUsers.values().next().value || this.createMockUser(
      this.generateUserId(),
      'mock@example.com',
      'Mock',
      'User'
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      kycStatus: user.kycStatus,
      kycTier: user.kycTier,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async getMyProfile(): Promise<ProfileResponse> {
    await this.delay(200);
    const user = mockUsers.values().next().value || this.createMockUser(
      this.generateUserId(),
      'mock@example.com',
      'Mock',
      'User'
    );
    return user;
  }

  async updateMyProfile(request: UpdateProfileRequest): Promise<ProfileResponse> {
    await this.delay(300);

    const current = await this.getMyProfile();
    const updated: ProfileResponse = {
      ...current,
      ...request,
    };
    mockUsers.set(current.id, updated);
    return updated;
  }

  async getMyLimits(): Promise<UserLimitsResponse> {
    await this.delay(200);

    return {
      kycTier: 'TIER_2' as KycTier,
      dailySendLimitCents: 1000000, // $10,000
      dailyReceiveLimitCents: 2000000,
      singleTransactionMaxCents: 500000,
      monthlyVolumeLimitCents: 20000000,
      maxTransactionsPerDay: 50,
      maxTransactionsPerHour: 10,
      canSendInternational: true,
      canReceiveMerchantPayments: true,
    };
  }

  async getMyDailyUsage(): Promise<DailyUsageResponse> {
    await this.delay(200);

    return {
      userId: 'mock-user-id',
      usageDate: new Date().toISOString().split('T')[0],
      totalSentCents: 150000,
      totalSentCount: 5,
      totalReceivedCents: 200000,
      totalReceivedCount: 3,
    };
  }

  async checkLimit(request: CheckLimitRequest): Promise<LimitCheckResponse> {
    await this.delay(150);

    return {
      allowed: true,
      remainingDailyCents: 850000,
    };
  }

  async getMyContacts(): Promise<ContactResponse[]> {
    await this.delay(200);

    const userId = mockUsers.values().next().value?.id || 'mock-user-id';
    return mockContacts.get(userId) || [];
  }

  async addContact(request: AddContactRequest): Promise<ContactResponse> {
    await this.delay(250);

    const userId = mockUsers.values().next().value?.id || 'mock-user-id';
    const contactId = `contact-mock-${contactCounter++}`;

    const contact: ContactResponse = {
      id: contactId,
      contactUserId: request.contactUserId,
      email: 'contact@example.com',
      firstName: 'Contact',
      lastName: 'User',
      nickname: request.nickname,
      totalTransactions: 0,
      isFavorite: false,
    };

    const contacts = mockContacts.get(userId) || [];
    contacts.push(contact);
    mockContacts.set(userId, contacts);

    return contact;
  }

  async removeContact(contactId: string): Promise<void> {
    await this.delay(200);

    const userId = mockUsers.values().next().value?.id || 'mock-user-id';
    const contacts = mockContacts.get(userId) || [];
    const filtered = contacts.filter((c) => c.id !== contactId);
    mockContacts.set(userId, filtered);
  }

  async uploadKycDocument(request: UploadKycDocumentRequest): Promise<KycDocumentResponse> {
    await this.delay(400);

    const userId = mockUsers.values().next().value?.id || 'mock-user-id';
    const docId = `doc-mock-${documentCounter++}`;

    const document: KycDocumentResponse = {
      id: docId,
      userId,
      documentType: request.documentType,
      documentNumber: request.documentNumber,
      documentCountry: request.documentCountry,
      fileUrl: request.fileUrl,
      verificationStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docs = mockDocuments.get(userId) || [];
    docs.push(document);
    mockDocuments.set(userId, docs);

    return document;
  }

  async getMyDocuments(): Promise<KycDocumentResponse[]> {
    await this.delay(200);

    const userId = mockUsers.values().next().value?.id || 'mock-user-id';
    return mockDocuments.get(userId) || [];
  }

  async getDocumentById(id: string): Promise<KycDocumentResponse> {
    await this.delay(200);

    const userId = mockUsers.values().next().value?.id || 'mock-user-id';
    const docs = mockDocuments.get(userId) || [];
    const doc = docs.find((d) => d.id === id);

    if (!doc) {
      throw new Error(`Document ${id} not found`);
    }

    return doc;
  }

  // Token helpers (mock - no-op)
  setToken(token: string): void {
    // Mock implementation
  }

  clearToken(): void {
    // Mock implementation
  }
}

export default MockUserServiceClient;

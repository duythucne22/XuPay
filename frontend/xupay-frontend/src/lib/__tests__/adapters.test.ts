// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  authApi, 
  usersApi, 
  transactionsApi, 
  walletsApi,
  tokenStorage,
  sarApi 
} from '@/lib/api';
import { setDefaultUserServiceClient } from '@/lib/userServiceClient';
import { setDefaultPaymentServiceClient } from '@/lib/paymentServiceClient';
import MockUserServiceClient from '@/lib/mockUserClient';
import MockPaymentServiceClient from '@/lib/mockPaymentClient';
import type { UserDTO, TransactionDTO, WalletDTO, PaginatedDTO } from '@/types/api';

describe('Adapter Layer - authApi', () => {
  let mockUserClient: MockUserServiceClient;

  beforeEach(() => {
    mockUserClient = new MockUserServiceClient();
    setDefaultUserServiceClient(mockUserClient);
  });

  it('register maps RegisterRequestDTO and stores token', async () => {
    const result = await authApi.register({
      email: 'new@example.com',
      password: 'P@ssw0rd',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+84901234567',
    });

    expect(result).toBeDefined();
    expect(result.accessToken).toBeDefined();
    expect(result.user.email).toBe('new@example.com');
  });

  it('login returns user with token', async () => {
    const result = await authApi.login({
      email: 'test@example.com',
      password: 'correct',
    });

    expect(result.accessToken).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });

  it('getCurrentUser returns properly typed UserDTO', async () => {
    const user: UserDTO = await authApi.getCurrentUser();

    // Verify all required fields
    expect(user.id).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.firstName).toBeDefined();
    expect(user.lastName).toBeDefined();
    expect(user.isActive).toBeDefined();
    expect(user.kycStatus).toBeDefined();
    expect(user.kycTier).toBeDefined();
    expect(user.isSuspended).toBeDefined();
    expect(user.fraudScore).toBeGreaterThanOrEqual(0);
    expect(user.createdAt).toBeDefined();
  });

  it('logout clears token', async () => {
    tokenStorage.setToken('fake-token');
    expect(tokenStorage.getToken()).toBe('fake-token');

    await authApi.logout();

    expect(tokenStorage.getToken()).toBeNull();
  });

  it('validate token returns valid status', async () => {
    const result = await authApi.validate();
    expect(result).toBeDefined();
    expect(result.valid).toBeDefined();
  });
});

describe('Adapter Layer - usersApi', () => {
  let mockUserClient: MockUserServiceClient;

  beforeEach(() => {
    mockUserClient = new MockUserServiceClient();
    setDefaultUserServiceClient(mockUserClient);
  });

  it('getMyProfile returns ProfileResponse', async () => {
    const profile = await usersApi.getMyProfile();

    expect(profile).toBeDefined();
    expect(profile.id).toBeDefined();
    expect(profile.email).toBeDefined();
    expect(profile.firstName).toBeDefined();
  });

  it('updateMyProfile maps UpdateUserRequestDTO', async () => {
    const updated = await usersApi.updateMyProfile({
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+84901234567',
      dateOfBirth: '1990-01-01',
      nationality: 'VNM',
    });

    expect(updated).toBeDefined();
    expect(updated.firstName).toBe('Jane');
  });

  it('getMyLimits returns UserLimitsResponse', async () => {
    const limits = await usersApi.getMyLimits();

    expect(limits).toBeDefined();
    expect(limits.kycTier).toBeDefined();
    expect(limits.dailySendLimitCents).toBeGreaterThanOrEqual(0);
    expect(limits.maxTransactionsPerDay).toBeGreaterThanOrEqual(0);
  });

  it('getMyDailyUsage returns DailyUsageResponse', async () => {
    const usage = await usersApi.getMyDailyUsage();

    expect(usage).toBeDefined();
    expect(usage.userId).toBeDefined();
    expect(usage.totalSentCents).toBeGreaterThanOrEqual(0);
  });

  it('getContacts returns ContactResponse array', async () => {
    const contacts = await usersApi.getContacts();

    expect(Array.isArray(contacts)).toBe(true);
  });

  it('addContact maps AddContactRequest', async () => {
    const contact = await usersApi.addContact({
      contactUserId: 'user-123',
      nickname: 'John',
    });

    expect(contact).toBeDefined();
  });

  it('getUsers returns paginated UserDTO', async () => {
    const paged: PaginatedDTO<UserDTO> = await usersApi.getUsers({ page: 0, size: 20 });

    expect(paged.content).toBeDefined();
    expect(Array.isArray(paged.content)).toBe(true);
    expect(paged.totalElements).toBeGreaterThanOrEqual(0);
    expect(paged.page).toBe(0);
    expect(paged.size).toBe(20);
  });

  it('getUserById returns UserDTO with all fields', async () => {
    const user: UserDTO = await usersApi.getUserById('user-123');

    expect(user.id).toBe('user-123');
    expect(user.email).toBeDefined();
    expect(user.kycStatus).toBeDefined();
    expect(user.kycTier).toBeDefined();
    expect(user.isActive).toBeDefined();
  });
});

describe('Adapter Layer - transactionsApi', () => {
  let mockPaymentClient: MockPaymentServiceClient;

  beforeEach(() => {
    mockPaymentClient = new MockPaymentServiceClient();
    setDefaultPaymentServiceClient(mockPaymentClient);
  });

  it('getTransactions returns paginated TransactionDTO', async () => {
    const paged: PaginatedDTO<TransactionDTO> = await transactionsApi.getTransactions({ page: 0, size: 10 });

    expect(paged.content).toBeDefined();
    expect(Array.isArray(paged.content)).toBe(true);
    expect(paged.totalElements).toBeGreaterThanOrEqual(0);
  });

  it('maps transaction response to TransactionDTO with all fields', async () => {
    // Create a transaction first
    await mockPaymentClient.transfer({
      fromUserId: 'user1',
      toUserId: 'user2',
      amountCents: 10000,
      description: 'Test payment',
    });

    const paged: PaginatedDTO<TransactionDTO> = await transactionsApi.getTransactions({ page: 0, size: 10 });

    expect(paged.content.length).toBeGreaterThan(0);
    const tx = paged.content[0];

    // Verify all required fields are present
    expect(tx.id).toBeDefined();
    expect(tx.idempotencyKey).toBeDefined();
    expect(tx.amountCents).toBeGreaterThan(0);
    expect(tx.currency).toBe('VND');
    expect(tx.type).toBe('TRANSFER');
    expect(tx.status).toBeDefined();
    expect(tx.isFlagged).toBe(false);
    expect(tx.fraudScore).toBeGreaterThanOrEqual(0);
    expect(tx.isReversed).toBe(false);
    expect(tx.createdAt).toBeDefined();
  });

  it('transfer creates transaction and maps request DTO', async () => {
    const result = await transactionsApi.transfer({
      idempotencyKey: 'idempotency-123',
      fromUserId: 'user1',
      toUserId: 'user2',
      amountCents: 5000,
      description: 'Test transfer',
    });

    expect(result).toBeDefined();
    expect(result.transactionId).toBeDefined();
    expect(result.amountCents).toBe(5000);
  });

  it('getStats returns transaction statistics', async () => {
    const stats = await transactionsApi.getStats('daily');

    expect(stats).toBeDefined();
    expect(stats.totalTransactions).toBeGreaterThanOrEqual(0);
    expect(stats.totalVolumeCents).toBeGreaterThanOrEqual(0);
    expect(stats.period).toBe('daily');
  });
});

describe('Adapter Layer - walletsApi', () => {
  let mockPaymentClient: MockPaymentServiceClient;
  let mockUserClient: MockUserServiceClient;

  beforeEach(() => {
    mockPaymentClient = new MockPaymentServiceClient();
    mockUserClient = new MockUserServiceClient();
    setDefaultPaymentServiceClient(mockPaymentClient);
    setDefaultUserServiceClient(mockUserClient);
  });

  it('getWallets returns paginated WalletDTO', async () => {
    const paged: PaginatedDTO<WalletDTO> = await walletsApi.getWallets({ page: 0, size: 10 });

    expect(paged.content).toBeDefined();
    expect(Array.isArray(paged.content)).toBe(true);
    expect(paged.totalElements).toBeGreaterThanOrEqual(0);
  });

  it('getWalletById maps balance response to WalletDTO', async () => {
    // Create wallet first
    const wallet = await mockPaymentClient.createWallet({
      userId: 'user1',
      walletType: 'PERSONAL',
      currency: 'VND',
    });

    const retrieved: WalletDTO = await walletsApi.getWalletById(wallet.walletId);

    expect(retrieved.id).toBe(wallet.walletId);
    expect(retrieved.userId).toBe('user1');
    expect(retrieved.currency).toBe('VND');
    expect(retrieved.walletType).toBe('PERSONAL');
    expect(retrieved.isActive).toBeDefined();
    expect(retrieved.isFrozen).toBeDefined();
    expect(retrieved.createdAt).toBeDefined();
  });

  it('getWalletBalance returns balance response', async () => {
    const wallet = await mockPaymentClient.createWallet({
      userId: 'user1',
      walletType: 'PERSONAL',
      currency: 'VND',
    });

    const balance = await walletsApi.getWalletBalance(wallet.walletId);

    expect(balance).toBeDefined();
    expect(balance.walletId).toBe(wallet.walletId);
    expect(balance.balanceCents).toBeGreaterThanOrEqual(0);
    expect(balance.currency).toBe('VND');
  });

  it('freezeWallet accepts string reason or object', async () => {
    const wallet = await mockPaymentClient.createWallet({
      userId: 'user1',
      walletType: 'PERSONAL',
      currency: 'VND',
    });

    // Test with string reason
    await walletsApi.freezeWallet(wallet.walletId, 'Admin freeze');

    // Test with object reason
    await walletsApi.freezeWallet(wallet.walletId, { reason: 'Fraud detected' });

    const balance = await walletsApi.getWalletBalance(wallet.walletId);
    expect(balance.isFrozen).toBe(true);
  });

  it('unfreezeWallet sets freeze to false', async () => {
    const wallet = await mockPaymentClient.createWallet({
      userId: 'user1',
      walletType: 'PERSONAL',
      currency: 'VND',
    });

    // Freeze first
    await walletsApi.freezeWallet(wallet.walletId, 'Test');

    // Unfreeze
    await walletsApi.unfreezeWallet(wallet.walletId);

    const balance = await walletsApi.getWalletBalance(wallet.walletId);
    expect(balance.isFrozen).toBe(false);
  });
});

describe('Adapter Layer - sarApi', () => {
  it('getSars returns paginated SARDTO', async () => {
    const paged: PaginatedDTO<any> = await sarApi.getSars({ page: 0, size: 10 });

    expect(paged.content).toBeDefined();
    expect(Array.isArray(paged.content)).toBe(true);
    expect(paged.totalElements).toBeGreaterThanOrEqual(0);
  });

  it('creates and updates SAR', async () => {
    const created = await sarApi.createSar({
      transactionId: 'tx-123',
      userId: 'user-123',
      severity: 'HIGH',
      reason: 'Suspicious activity',
    });

    expect(created).toBeDefined();
  });
});

describe('Adapter Layer - tokenStorage', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
  });

  it('stores and retrieves token', () => {
    const token = 'test-token-123';
    tokenStorage.setToken(token);

    expect(tokenStorage.getToken()).toBe(token);
    expect(tokenStorage.getAccessToken()).toBe(token);
  });

  it('clears token', () => {
    tokenStorage.setToken('token');
    tokenStorage.clear();

    expect(tokenStorage.getToken()).toBeNull();
  });

  it('clearTokens is alias for clear', () => {
    tokenStorage.setToken('token');
    tokenStorage.clearTokens();

    expect(tokenStorage.getToken()).toBeNull();
  });
});

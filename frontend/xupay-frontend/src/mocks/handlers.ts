// ============================================================
// MSW HANDLERS - Mock Service Worker request handlers
// Intercepts HTTP requests and returns mock responses
// ============================================================

import { http, HttpResponse } from 'msw';

// Mock data stores (simple in-memory)
const mockUsers = new Map();
const mockWallets = new Map();
const mockTransactions = new Map();
const mockIdempotencyKeys = new Map();

let userCounter = 1000;
let walletCounter = 5000;
let txCounter = 10000;

// ============================================================
// USER SERVICE HANDLERS (port 8081)
// ============================================================

export const userServiceHandlers = [
  // Register
  http.post('http://localhost:8081/api/auth/register', async ({ request }) => {
    const body = await request.json() as any;
    const userId = `user-${userCounter++}-${Date.now()}`;
    const token = `mock-jwt-${Date.now()}`;

    const user = {
      id: userId,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      kycStatus: 'PENDING',
      kycTier: 'TIER_0',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    mockUsers.set(userId, user);

    return HttpResponse.json({
      accessToken: token,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      user,
      userId,
    }, { status: 201 });
  }),

  // Login
  http.post('http://localhost:8081/api/auth/login', async ({ request }) => {
    const body = await request.json() as any;
    const userId = `user-${userCounter++}`;
    const token = `mock-jwt-${Date.now()}`;

    const user = {
      id: userId,
      email: body.email,
      firstName: 'Mock',
      lastName: 'User',
      kycStatus: 'APPROVED',
      kycTier: 'TIER_2',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      accessToken: token,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      user,
      userId,
    });
  }),

  // Logout
  http.post('http://localhost:8081/api/auth/logout', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Get current user
  http.get('http://localhost:8081/api/auth/me', () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'mock@example.com',
      firstName: 'Mock',
      lastName: 'User',
      kycStatus: 'APPROVED',
      kycTier: 'TIER_2',
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  }),

  // Validate token (simple success response)
  http.get('http://localhost:8081/api/auth/validate', () => {
    return HttpResponse.json({ valid: true });
  }),

  // Get profile
  http.get('http://localhost:8081/api/users/me/profile', () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'mock@example.com',
      firstName: 'Mock',
      lastName: 'User',
      kycStatus: 'APPROVED',
      kycTier: 'TIER_2',
      isActive: true,
      isSuspended: false,
      fraudScore: 5,
      createdAt: new Date().toISOString(),
    });
  }),

  // Update profile
  http.put('http://localhost:8081/api/users/me/profile', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'mock@example.com',
      ...body,
      kycStatus: 'APPROVED',
      kycTier: 'TIER_2',
      isActive: true,
      isSuspended: false,
      fraudScore: 5,
      createdAt: new Date().toISOString(),
    });
  }),

  // Get limits
  http.get('http://localhost:8081/api/users/me/limits', () => {
    return HttpResponse.json({
      kycTier: 'TIER_2',
      dailySendLimitCents: 1000000,
      dailyReceiveLimitCents: 2000000,
      singleTransactionMaxCents: 500000,
      monthlyVolumeLimitCents: 20000000,
      maxTransactionsPerDay: 50,
      maxTransactionsPerHour: 10,
      canSendInternational: true,
      canReceiveMerchantPayments: true,
    });
  }),

  // Get contacts
  http.get('http://localhost:8081/api/users/me/contacts', () => {
    return HttpResponse.json([]);
  }),

  // Add contact
  http.post('http://localhost:8081/api/users/me/contacts', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      id: `contact-${Date.now()}`,
      contactUserId: body.contactUserId,
      email: 'contact@example.com',
      firstName: 'Contact',
      lastName: 'User',
      nickname: body.nickname,
      totalTransactions: 0,
      isFavorite: false,
    }, { status: 201 });
  }),
];

// ============================================================
// PAYMENT SERVICE HANDLERS (port 8082)
// ============================================================

export const paymentServiceHandlers = [
  // Transfer
  http.post('http://localhost:8082/api/payments/transfer', async ({ request }) => {
    const body = await request.json() as any;
    const idempotencyKey = request.headers.get('X-Idempotency-Key') || body.idempotencyKey;

    // Check idempotency
    if (idempotencyKey && mockIdempotencyKeys.has(idempotencyKey)) {
      return HttpResponse.json(mockIdempotencyKeys.get(idempotencyKey));
    }

    const transactionId = `tx-${txCounter++}-${Date.now()}`;

    const response = {
      transactionId,
      idempotencyKey,
      fromUserId: body.fromUserId,
      toUserId: body.toUserId,
      amountCents: body.amountCents,
      amount: body.amountCents / 100,
      currency: 'VND',
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    mockTransactions.set(transactionId, response);
    if (idempotencyKey) {
      mockIdempotencyKeys.set(idempotencyKey, response);
    }

    return HttpResponse.json(response, { status: 201 });
  }),

  // Get transaction
  http.get('http://localhost:8082/api/payments/:transactionId', ({ params }) => {
    const { transactionId } = params;
    const tx = mockTransactions.get(transactionId);

    if (!tx) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Transaction not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      transactionId: tx.transactionId,
      type: 'TRANSFER',
      status: tx.status,
      amountCents: tx.amountCents,
      currency: tx.currency,
      description: 'Mock transaction',
      createdAt: tx.createdAt,
    });
  }),

  // Get by idempotency key
  http.get('http://localhost:8082/api/payments/idempotency/:idempotencyKey', ({ params }) => {
    const { idempotencyKey } = params;
    const tx = mockIdempotencyKeys.get(idempotencyKey);

    if (!tx) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Transaction not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(tx);
  }),

  // List transactions
  http.get('http://localhost:8082/api/payments', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '20');

    const allTxs = Array.from(mockTransactions.values());
    const start = page * size;
    const items = allTxs.slice(start, start + size);

    return HttpResponse.json({
      items,
      total: allTxs.length,
    });
  }),

  // Create wallet
  http.post('http://localhost:8082/api/wallets', async ({ request }) => {
    const body = await request.json() as any;
    const walletId = `wallet-${walletCounter++}`;

    const wallet = {
      walletId,
      userId: body.userId,
      glAccountCode: `GL-${walletCounter}`,
      walletType: body.walletType,
      currency: body.currency,
      balanceCents: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    mockWallets.set(walletId, wallet);

    return HttpResponse.json(wallet, { status: 201 });
  }),

  // Get wallet by user
  http.get('http://localhost:8082/api/wallets/user/:userId', ({ params }) => {
    const { userId } = params;

    // Find or create mock wallet
    let wallet = Array.from(mockWallets.values()).find((w: any) => w.userId === userId);

    if (!wallet) {
      const walletId = `wallet-${walletCounter++}`;
      wallet = {
        walletId,
        userId,
        balanceCents: 500000,
        balanceAmount: 5000,
        currency: 'VND',
        isActive: true,
        isFrozen: false,
      };
      mockWallets.set(walletId, wallet);
    }

    return HttpResponse.json(wallet);
  }),

  // Get wallet balance
  http.get('http://localhost:8082/api/wallets/:walletId/balance', ({ params }) => {
    const { walletId } = params;
    const wallet = mockWallets.get(walletId);

    if (!wallet) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Wallet not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(wallet);
  }),

  // Freeze wallet
  http.put('http://localhost:8082/api/wallets/:walletId/freeze', async ({ params, request }) => {
    const { walletId } = params;
    const body = await request.json() as any;
    const wallet = mockWallets.get(walletId);

    if (!wallet) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Wallet not found' },
        { status: 404 }
      );
    }

    wallet.isFrozen = body.freeze;
    // Preserve optional freeze reason for assertions
    wallet.freezeReason = body.reason ?? null;
    return new HttpResponse(wallet, { status: 200 });
  }),
];

// ============================================================
// EXPORT ALL HANDLERS
// ============================================================

export const handlers = [...userServiceHandlers, ...paymentServiceHandlers];

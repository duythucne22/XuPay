// ============================================================
// MOCK PAYMENT SERVICE CLIENT
// In-memory client for development/testing without backend
// ============================================================

import type {
  TransferRequest,
  TransferResponse,
  TransactionDetailResponse,
  CreateWalletRequest,
  CreateWalletResponse,
  WalletBalanceResponse,
  FreezeWalletRequest,
  TransactionStatus,
} from './paymentServiceClient';

// Simple in-memory stores
const mockTransactions = new Map<string, TransactionDetailResponse>();
const mockWallets = new Map<string, WalletBalanceResponse>();
const mockIdempotencyKeys = new Map<string, TransferResponse>();

let transactionCounter = 1000;
let walletCounter = 5000;

/**
 * MockPaymentServiceClient - implements same interface as PaymentServiceClient
 * Returns realistic mock data with simulated delays
 */
export class MockPaymentServiceClient {
  private delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateTransactionId(): string {
    return `tx-mock-${transactionCounter++}-${Date.now()}`;
  }

  private generateWalletId(): string {
    return `wallet-mock-${walletCounter++}`;
  }

  async transfer(request: TransferRequest): Promise<TransferResponse> {
    await this.delay(400);

    // Check idempotency
    if (request.idempotencyKey && mockIdempotencyKeys.has(request.idempotencyKey)) {
      return mockIdempotencyKeys.get(request.idempotencyKey)!;
    }

    const transactionId = this.generateTransactionId();
    const status: TransactionStatus = 'COMPLETED';

    const response: TransferResponse = {
      transactionId,
      idempotencyKey: request.idempotencyKey,
      fromUserId: request.fromUserId,
      toUserId: request.toUserId,
      amountCents: request.amountCents,
      amount: request.amountCents / 100,
      currency: 'VND',
      status,
      createdAt: new Date().toISOString(),
    };

    // Store in mock DB
    const detail: TransactionDetailResponse = {
      transactionId,
      type: 'TRANSFER',
      status,
      amountCents: request.amountCents,
      currency: 'VND',
      description: request.description,
      createdAt: response.createdAt,
    };
    mockTransactions.set(transactionId, detail);

    if (request.idempotencyKey) {
      mockIdempotencyKeys.set(request.idempotencyKey, response);
    }

    return response;
  }

  async getTransaction(transactionId: string): Promise<TransactionDetailResponse> {
    await this.delay(200);

    const tx = mockTransactions.get(transactionId);
    if (!tx) {
      throw new Error(`Transaction ${transactionId} not found`);
    }
    return tx;
  }

  async getByIdempotencyKey(idempotencyKey: string): Promise<TransferResponse | null> {
    await this.delay(200);
    return mockIdempotencyKeys.get(idempotencyKey) || null;
  }

  async listTransactions(params: {
    userId?: string;
    page?: number;
    size?: number;
  } = {}): Promise<{ items: TransactionDetailResponse[]; total?: number }> {
    await this.delay(300);

    const allTxs = Array.from(mockTransactions.values());
    const page = params.page || 0;
    const size = params.size || 20;
    const start = page * size;
    const items = allTxs.slice(start, start + size);

    return {
      items,
      total: allTxs.length,
    };
  }

  async createWallet(request: CreateWalletRequest): Promise<CreateWalletResponse> {
    await this.delay(250);

    const walletId = this.generateWalletId();

    const wallet: CreateWalletResponse = {
      walletId,
      userId: request.userId,
      glAccountCode: `GL-${walletCounter}`,
      walletType: request.walletType,
      currency: request.currency,
      balanceCents: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    // Store in mock wallet store
    mockWallets.set(walletId, {
      walletId,
      userId: request.userId,
      balanceCents: 0,
      balanceAmount: 0,
      currency: request.currency,
      isActive: true,
      isFrozen: false,
    });

    return wallet;
  }

  async getWalletByUserId(userId: string): Promise<WalletBalanceResponse> {
    await this.delay(200);

    // Find wallet by userId
    for (const wallet of mockWallets.values()) {
      if (wallet.userId === userId) {
        return wallet;
      }
    }

    // Return a default mock wallet if none found
    const mockWallet: WalletBalanceResponse = {
      walletId: this.generateWalletId(),
      userId,
      balanceCents: 500000,
      balanceAmount: 5000,
      currency: 'VND',
      isActive: true,
      isFrozen: false,
    };
    mockWallets.set(mockWallet.walletId, mockWallet);
    return mockWallet;
  }

  async getWalletBalance(walletId: string): Promise<WalletBalanceResponse> {
    await this.delay(150);

    const wallet = mockWallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet ${walletId} not found`);
    }
    return wallet;
  }

  async freezeWallet(walletId: string, request: FreezeWalletRequest): Promise<void> {
    await this.delay(200);

    const wallet = mockWallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet ${walletId} not found`);
    }

    wallet.isFrozen = request.freeze;
  }

  // Token helpers (mock - no-op)
  setToken(token: string): void {
    // Mock implementation - would store in memory or no-op
  }

  clearToken(): void {
    // Mock implementation
  }
}

export default MockPaymentServiceClient;

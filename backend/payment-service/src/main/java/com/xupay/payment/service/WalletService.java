package com.xupay.payment.service;

import com.xupay.payment.dto.CreateWalletRequest;
import com.xupay.payment.dto.CreateWalletResponse;
import com.xupay.payment.dto.FreezeWalletRequest;
import com.xupay.payment.dto.WalletBalanceResponse;

import java.util.UUID;

/**
 * WalletService
 * Business logic for wallet operations.
 */
public interface WalletService {

    /**
     * Create a new wallet for a user.
     * Links to appropriate GL account based on wallet type.
     */
    CreateWalletResponse createWallet(CreateWalletRequest request);

    /**
     * Get wallet information by user ID.
     */
    WalletBalanceResponse getWalletByUserId(UUID userId);

    /**
     * Get wallet balance.
     * Calls PostgreSQL get_wallet_balance() function.
     */
    WalletBalanceResponse getWalletBalance(UUID walletId);

    /**
     * Freeze or unfreeze a wallet.
     * Frozen wallets cannot perform transactions.
     */
    void freezeWallet(UUID walletId, FreezeWalletRequest request);
}

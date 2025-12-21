package com.xupay.payment.service.impl;

import com.xupay.payment.dto.CreateWalletRequest;
import com.xupay.payment.dto.CreateWalletResponse;
import com.xupay.payment.dto.FreezeWalletRequest;
import com.xupay.payment.dto.WalletBalanceResponse;
import com.xupay.payment.entity.ChartOfAccounts;
import com.xupay.payment.entity.Wallet;
import com.xupay.payment.entity.enums.WalletType;
import com.xupay.payment.repository.ChartOfAccountsRepository;
import com.xupay.payment.repository.WalletRepository;
import com.xupay.payment.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

/**
 * WalletServiceImpl
 * Implementation of wallet business logic.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final ChartOfAccountsRepository chartOfAccountsRepository;

    @Override
    @Transactional
    public CreateWalletResponse createWallet(CreateWalletRequest request) {
        log.info("Creating wallet for user: {}, type: {}", request.getUserId(), request.getWalletType());

        // Check if wallet already exists
        if (walletRepository.existsByUserId(request.getUserId())) {
            throw new IllegalArgumentException("Wallet already exists for user: " + request.getUserId());
        }

        // Get GL account code based on wallet type
        String glAccountCode = getGlAccountCodeForWalletType(request.getWalletType());

        // Verify GL account exists
        ChartOfAccounts glAccount = chartOfAccountsRepository.findByAccountCode(glAccountCode)
                .orElseThrow(() -> new IllegalArgumentException("GL account not found: " + glAccountCode));

        if (!glAccount.getIsActive()) {
            throw new IllegalArgumentException("GL account is not active: " + glAccountCode);
        }

        // Create wallet
        Wallet wallet = new Wallet();
        wallet.setUserId(request.getUserId());
        wallet.setGlAccountCode(glAccountCode);
        wallet.setWalletType(request.getWalletType());
        wallet.setCurrency(request.getCurrency());
        wallet.setIsActive(true);
        wallet.setIsFrozen(false);

        Wallet savedWallet = walletRepository.save(wallet);
        log.info("Wallet created successfully: {}", savedWallet.getId());

        return CreateWalletResponse.builder()
                .walletId(savedWallet.getId())
                .userId(savedWallet.getUserId())
                .glAccountCode(savedWallet.getGlAccountCode())
                .walletType(savedWallet.getWalletType())
                .currency(savedWallet.getCurrency())
                .balanceCents(0L)  // New wallet always has 0 balance
                .isActive(savedWallet.getIsActive())
                .createdAt(savedWallet.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public WalletBalanceResponse getWalletByUserId(UUID userId) {
        log.info("Getting wallet for user: {}", userId);

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found for user: " + userId));

        return getWalletBalance(wallet.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public WalletBalanceResponse getWalletBalance(UUID walletId) {
        log.info("Getting balance for wallet: {}", walletId);

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found: " + walletId));

        // Call PostgreSQL function to get balance
        Long balanceCents = walletRepository.getBalance(walletId);
        if (balanceCents == null) {
            balanceCents = 0L;
        }

        // Convert cents to currency amount (e.g., 10050 cents = 100.50 VND)
        BigDecimal balanceAmount = BigDecimal.valueOf(balanceCents)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        return WalletBalanceResponse.builder()
                .walletId(wallet.getId())
                .userId(wallet.getUserId())
                .balanceCents(balanceCents)
                .balanceAmount(balanceAmount)
                .currency(wallet.getCurrency())
                .isActive(wallet.getIsActive())
                .isFrozen(wallet.getIsFrozen())
                .build();
    }

    @Override
    @Transactional
    public void freezeWallet(UUID walletId, FreezeWalletRequest request) {
        log.info("Freezing wallet: {}, freeze: {}", walletId, request.getFreeze());

        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found: " + walletId));

        if (Boolean.TRUE.equals(request.getFreeze())) {
            wallet.setIsFrozen(true);
            wallet.setFreezeReason(request.getReason());
            log.info("Wallet frozen: {}, reason: {}", walletId, request.getReason());
        } else {
            wallet.setIsFrozen(false);
            wallet.setFreezeReason(null);
            log.info("Wallet unfrozen: {}", walletId);
        }

        walletRepository.save(wallet);
    }

    /**
     * Map wallet type to GL account code.
     * This follows the standard Chart of Accounts structure.
     */
    private String getGlAccountCodeForWalletType(WalletType walletType) {
        return switch (walletType) {
            case PERSONAL -> "1110";  // Cash - Personal Wallets
            case BUSINESS -> "1120";  // Cash - Business Wallets
            case MERCHANT -> "1130";  // Cash - Merchant Wallets
        };
    }
}

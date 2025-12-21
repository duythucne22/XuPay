package com.xupay.payment.controller;

import com.xupay.payment.dto.CreateWalletRequest;
import com.xupay.payment.dto.CreateWalletResponse;
import com.xupay.payment.dto.FreezeWalletRequest;
import com.xupay.payment.dto.WalletBalanceResponse;
import com.xupay.payment.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * WalletController
 * REST endpoints for wallet operations.
 */
@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
@Slf4j
public class WalletController {

    private final WalletService walletService;

    /**
     * Create a new wallet for a user.
     * POST /api/wallets
     */
    @PostMapping
    public ResponseEntity<CreateWalletResponse> createWallet(@Valid @RequestBody CreateWalletRequest request) {
        log.info("REST request to create wallet for user: {}", request.getUserId());
        CreateWalletResponse response = walletService.createWallet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get wallet by user ID.
     * GET /api/wallets/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<WalletBalanceResponse> getWalletByUserId(@PathVariable UUID userId) {
        log.info("REST request to get wallet for user: {}", userId);
        WalletBalanceResponse response = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get wallet balance.
     * GET /api/wallets/{walletId}/balance
     */
    @GetMapping("/{walletId}/balance")
    public ResponseEntity<WalletBalanceResponse> getWalletBalance(@PathVariable UUID walletId) {
        log.info("REST request to get balance for wallet: {}", walletId);
        WalletBalanceResponse response = walletService.getWalletBalance(walletId);
        return ResponseEntity.ok(response);
    }

    /**
     * Freeze or unfreeze a wallet.
     * PUT /api/wallets/{walletId}/freeze
     */
    @PutMapping("/{walletId}/freeze")
    public ResponseEntity<Void> freezeWallet(@PathVariable UUID walletId, 
                                             @Valid @RequestBody FreezeWalletRequest request) {
        log.info("REST request to freeze wallet: {}, freeze: {}", walletId, request.getFreeze());
        walletService.freezeWallet(walletId, request);
        return ResponseEntity.ok().build();
    }
}

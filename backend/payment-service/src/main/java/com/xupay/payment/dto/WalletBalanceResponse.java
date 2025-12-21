package com.xupay.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * WalletBalanceResponse
 * Response containing wallet balance information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletBalanceResponse {

    private UUID walletId;
    private UUID userId;
    private Long balanceCents;  // Balance in cents
    private BigDecimal balanceAmount;  // Balance in currency units (e.g., 100.50)
    private String currency;
    private Boolean isActive;
    private Boolean isFrozen;
}

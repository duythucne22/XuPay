package com.xupay.payment.dto;

import com.xupay.payment.entity.enums.WalletType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * CreateWalletResponse
 * Response after successfully creating a wallet.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateWalletResponse {

    private UUID walletId;
    private UUID userId;
    private String glAccountCode;
    private WalletType walletType;
    private String currency;
    private Long balanceCents;  // Always 0 for new wallets
    private Boolean isActive;
    private LocalDateTime createdAt;
}

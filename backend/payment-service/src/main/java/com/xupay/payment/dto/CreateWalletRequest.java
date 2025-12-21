package com.xupay.payment.dto;

import com.xupay.payment.entity.enums.WalletType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * CreateWalletRequest
 * Request to create a new wallet for a user.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateWalletRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Wallet type is required")
    private WalletType walletType;

    private String currency = "VND";
}

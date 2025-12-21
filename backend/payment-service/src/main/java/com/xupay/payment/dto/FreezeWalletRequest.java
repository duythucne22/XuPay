package com.xupay.payment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FreezeWalletRequest
 * Request to freeze or unfreeze a wallet.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FreezeWalletRequest {

    private Boolean freeze;  // true to freeze, false to unfreeze

    @NotBlank(message = "Reason is required when freezing")
    private String reason;
}

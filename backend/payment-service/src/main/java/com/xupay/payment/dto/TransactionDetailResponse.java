package com.xupay.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * TransactionDetailResponse
 * Detailed transaction information including ledger entries.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDetailResponse {

    private UUID transactionId;
    private String type;
    private String status;
    private Long amountCents;
    private String currency;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    
    private List<LedgerEntryDetail> ledgerEntries;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LedgerEntryDetail {
        private UUID entryId;
        private String glAccountCode;
        private UUID walletId;
        private String entryType;  // DEBIT or CREDIT
        private Long amountCents;
        private String description;
        private LocalDateTime createdAt;
    }
}

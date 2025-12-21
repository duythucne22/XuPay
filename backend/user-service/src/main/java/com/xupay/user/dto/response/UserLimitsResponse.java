package com.xupay.user.dto.response;

import com.xupay.user.entity.enums.KycTier;

/**
 * UserLimitsResponse
 * Response DTO for user's transaction limits based on KYC tier.
 */
public record UserLimitsResponse(
    KycTier kycTier,
    Long dailySendLimitCents,
    Long dailyReceiveLimitCents,
    Long monthlyVolumeLimitCents,
    Long singleTransactionMaxCents,
    Integer maxTransactionsPerHour,
    Integer maxTransactionsPerDay,
    Boolean canSendInternational,
    Boolean canReceiveMerchantPayments
) {}

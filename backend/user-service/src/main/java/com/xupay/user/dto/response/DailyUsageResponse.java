package com.xupay.user.dto.response;

import java.time.LocalDate;

/**
 * DailyUsageResponse
 * Response DTO for user's daily transaction usage.
 */
public record DailyUsageResponse(
    LocalDate usageDate,
    Long totalSentCents,
    Long totalReceivedCents,
    Integer transactionCount,
    Long dailySendLimitCents,
    Long remainingSendLimitCents
) {}

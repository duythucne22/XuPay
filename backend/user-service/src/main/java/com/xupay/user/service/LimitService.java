package com.xupay.user.service;

import com.xupay.user.dto.response.DailyUsageResponse;
import com.xupay.user.dto.response.LimitCheckResponse;
import com.xupay.user.dto.response.UserLimitsResponse;

import java.util.UUID;

/**
 * LimitService
 * Business logic for transaction limit management and enforcement.
 */
public interface LimitService {

    /**
     * Get user's transaction limits based on KYC tier
     * @param userId User ID
     * @return User's limits and tier information
     * @throws com.xupay.user.exception.UserNotFoundException if user not found
     */
    UserLimitsResponse getUserLimits(UUID userId);

    /**
     * Get user's daily transaction usage
     * @param userId User ID
     * @return Today's usage statistics
     * @throws com.xupay.user.exception.UserNotFoundException if user not found
     */
    DailyUsageResponse getDailyUsage(UUID userId);

    /**
     * Check if a transaction is allowed within limits
     * @param userId User ID
     * @param amountCents Transaction amount in cents
     * @param type Transaction type ("send" or "receive")
     * @return Check result with allowed flag and reason
     * @throws com.xupay.user.exception.UserNotFoundException if user not found
     */
    LimitCheckResponse checkTransactionAllowed(UUID userId, Long amountCents, String type);

    /**
     * Check if user can send the specified amount
     * @param userId User ID
     * @param amountCents Amount in cents
     * @return true if allowed, false otherwise
     */
    boolean canSend(UUID userId, Long amountCents);

    /**
     * Check if user can receive the specified amount
     * @param userId User ID
     * @param amountCents Amount in cents
     * @return true if allowed, false otherwise
     */
    boolean canReceive(UUID userId, Long amountCents);
}

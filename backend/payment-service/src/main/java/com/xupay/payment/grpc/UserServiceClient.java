package com.xupay.payment.grpc;

import com.xupay.user.grpc.*;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * gRPC Client Wrapper for User Service
 * Provides high-level methods for Payment Service to call User Service
 */
@Service
@Slf4j
public class UserServiceClient {

    @GrpcClient("user-service")
    private UserServiceGrpc.UserServiceBlockingStub userServiceStub;

    /**
     * Validate user for transaction (comprehensive check: KYC, limits, account status)
     *
     * @param userId           User UUID
     * @param amountCents      Transaction amount in cents
     * @param transactionType  "send" or "receive"
     * @return ValidateUserResponse with validation result
     * @throws IllegalArgumentException if validation fails
     * @throws RuntimeException         if gRPC call fails
     */
    public ValidateUserResponse validateUser(UUID userId, Long amountCents, String transactionType) {
        try {
            log.debug("Validating user {} for {} transaction of {} cents", userId, transactionType, amountCents);

            ValidateUserRequest request = ValidateUserRequest.newBuilder()
                    .setUserId(userId.toString())
                    .setAmountCents(amountCents)
                    .setTransactionType(transactionType)
                    .build();

            ValidateUserResponse response = userServiceStub.validateUser(request);

            if (!response.getIsValid()) {
                log.warn("User validation failed for {}: {}", userId, response.getReason());
                throw new IllegalArgumentException("User validation failed: " + response.getReason());
            }

            log.debug("User {} validated successfully", userId);
            return response;

        } catch (StatusRuntimeException e) {
            log.error("gRPC call to User Service failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to validate user: " + e.getStatus().getDescription(), e);
        }
    }

    /**
     * Get user details by ID
     *
     * @param userId User UUID
     * @return GetUserResponse with user information
     * @throws RuntimeException if user not found or gRPC call fails
     */
    public GetUserResponse getUser(UUID userId) {
        try {
            log.debug("Fetching user details for {}", userId);

            GetUserRequest request = GetUserRequest.newBuilder()
                    .setUserId(userId.toString())
                    .build();

            GetUserResponse response = userServiceStub.getUser(request);

            log.debug("User details retrieved for {}", userId);
            return response;

        } catch (StatusRuntimeException e) {
            log.error("gRPC call to User Service failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get user: " + e.getStatus().getDescription(), e);
        }
    }

    /**
     * Check if transaction amount is within user's limits
     *
     * @param userId           User UUID
     * @param amountCents      Transaction amount in cents
     * @param transactionType  "send", "receive", or "withdraw"
     * @return CheckLimitResponse with limit check result
     * @throws IllegalArgumentException if limit exceeded
     * @throws RuntimeException         if gRPC call fails
     */
    public CheckLimitResponse checkTransactionLimit(UUID userId, Long amountCents, String transactionType) {
        try {
            log.debug("Checking transaction limit for user {} (amount: {} cents)", userId, amountCents);

            CheckLimitRequest request = CheckLimitRequest.newBuilder()
                    .setUserId(userId.toString())
                    .setAmountCents(amountCents)
                    .setTransactionType(transactionType)
                    .build();

            CheckLimitResponse response = userServiceStub.checkTransactionLimit(request);

            if (!response.getAllowed()) {
                log.warn("Transaction limit exceeded for {}: {}", userId, response.getReason());
                throw new IllegalArgumentException("Transaction limit exceeded: " + response.getReason());
            }

            log.debug("Transaction limit check passed for {}", userId);
            return response;

        } catch (StatusRuntimeException e) {
            log.error("gRPC call to User Service failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to check transaction limit: " + e.getStatus().getDescription(), e);
        }
    }

    /**
     * Get user's KYC status and tier limits
     *
     * @param userId User UUID
     * @return GetKycStatusResponse with KYC information
     * @throws RuntimeException if gRPC call fails
     */
    public GetKycStatusResponse getKycStatus(UUID userId) {
        try {
            log.debug("Fetching KYC status for {}", userId);

            GetKycStatusRequest request = GetKycStatusRequest.newBuilder()
                    .setUserId(userId.toString())
                    .build();

            GetKycStatusResponse response = userServiceStub.getKycStatus(request);

            log.debug("KYC status retrieved for {}: {}", userId, response.getKycStatus());
            return response;

        } catch (StatusRuntimeException e) {
            log.error("gRPC call to User Service failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get KYC status: " + e.getStatus().getDescription(), e);
        }
    }

    /**
     * Record transaction in User Service for daily usage tracking (ASYNC)
     * This method is non-blocking - payment confirmation does not wait for this call
     *
     * @param userId          User UUID
     * @param amountCents     Transaction amount in cents
     * @param transactionType "send" or "receive"
     * @param transactionId   Transaction UUID for idempotency
     * @return CompletableFuture that completes when recording is done
     */
    public CompletableFuture<RecordTransactionResponse> recordTransactionAsync(
            UUID userId, Long amountCents, String transactionType, UUID transactionId) {

        return CompletableFuture.supplyAsync(() -> {
            try {
                log.debug("Recording transaction {} for user {} (async)", transactionId, userId);

                RecordTransactionRequest request = RecordTransactionRequest.newBuilder()
                        .setUserId(userId.toString())
                        .setAmountCents(amountCents)
                        .setTransactionType(transactionType)
                        .setTransactionId(transactionId.toString())
                        .build();

                RecordTransactionResponse response = userServiceStub.recordTransaction(request);

                log.debug("Transaction {} recorded successfully for user {}", transactionId, userId);
                return response;

            } catch (StatusRuntimeException e) {
                // Log error but don't fail the payment (async operation)
                log.error("Failed to record transaction {} for user {}: {}", transactionId, userId, e.getMessage());
                return RecordTransactionResponse.newBuilder()
                        .setSuccess(false)
                        .setMessage("Recording failed: " + e.getStatus().getDescription())
                        .build();
            }
        });
    }

    /**
     * Record transaction synchronously (for blocking scenarios)
     */
    public RecordTransactionResponse recordTransaction(
            UUID userId, Long amountCents, String transactionType, UUID transactionId) {

        try {
            log.debug("Recording transaction {} for user {} (sync)", transactionId, userId);

            RecordTransactionRequest request = RecordTransactionRequest.newBuilder()
                    .setUserId(userId.toString())
                    .setAmountCents(amountCents)
                    .setTransactionType(transactionType)
                    .setTransactionId(transactionId.toString())
                    .build();

            RecordTransactionResponse response = userServiceStub.recordTransaction(request);

            log.debug("Transaction {} recorded successfully for user {}", transactionId, userId);
            return response;

        } catch (StatusRuntimeException e) {
            log.error("gRPC call to User Service failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to record transaction: " + e.getStatus().getDescription(), e);
        }
    }
}

package com.xupay.user.grpc;

import com.xupay.user.dto.response.LimitCheckResponse;
import com.xupay.user.entity.User;
import com.xupay.user.exception.UserNotFoundException;
import com.xupay.user.repository.DailyUsageRepository;
import com.xupay.user.repository.TransactionLimitRepository;
import com.xupay.user.repository.UserRepository;
import com.xupay.user.service.LimitService;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import java.time.LocalDate;
import java.util.UUID;

/**
 * gRPC Service Implementation for User Service
 * Exposes user validation and transaction limit checking APIs
 * to Payment Service for inter-service communication
 */
@GrpcService
@RequiredArgsConstructor
@Slf4j
public class UserGrpcServiceImpl extends UserServiceGrpc.UserServiceImplBase {

    private final UserRepository userRepository;
    private final LimitService limitService;
    private final DailyUsageRepository dailyUsageRepository;
    private final TransactionLimitRepository transactionLimitRepository;

    /**
     * Validates if a user can perform a transaction
     * Checks: user exists, is active, KYC approved, within limits
     */
    @Override
    public void validateUser(ValidateUserRequest request, StreamObserver<ValidateUserResponse> responseObserver) {
        try {
            log.info("gRPC ValidateUser called: userId={}, amount={}, type={}", 
                    request.getUserId(), request.getAmountCents(), request.getTransactionType());

            // Parse and validate UUID
            UUID userId = parseUserId(request.getUserId());
            
            // Fetch user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException(userId));

            // Check if user can transact (active + not suspended + KYC approved)
            if (!user.canTransact()) {
                String reason = buildUserCannotTransactReason(user);
                ValidateUserResponse response = ValidateUserResponse.newBuilder()
                        .setIsValid(false)
                        .setReason(reason)
                        .build();
                
                log.warn("User validation failed: userId={}, reason={}", userId, reason);
                responseObserver.onNext(response);
                responseObserver.onCompleted();
                return;
            }

            // Check transaction limits
            LimitCheckResponse limitCheck = limitService.checkTransactionAllowed(
                    userId, 
                    request.getAmountCents(), 
                    request.getTransactionType()
            );

            if (!limitCheck.allowed()) {
                ValidateUserResponse response = ValidateUserResponse.newBuilder()
                        .setIsValid(false)
                        .setReason(limitCheck.reason())
                        .build();
                
                log.warn("Transaction limit check failed: userId={}, reason={}", userId, limitCheck.reason());
                responseObserver.onNext(response);
                responseObserver.onCompleted();
                return;
            }

            // All checks passed - user is valid
            ValidateUserResponse response = ValidateUserResponse.newBuilder()
                    .setIsValid(true)
                    .setReason("")
                    .setUser(mapToUserInfo(user))
                    .build();

            log.info("User validation successful: userId={}", userId);
            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (IllegalArgumentException e) {
            log.error("Invalid user ID format: {}", request.getUserId(), e);
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription("Invalid user ID format: " + e.getMessage())
                    .asRuntimeException());
        } catch (UserNotFoundException e) {
            log.error("User not found: {}", request.getUserId(), e);
            responseObserver.onError(Status.NOT_FOUND
                    .withDescription("User not found: " + request.getUserId())
                    .asRuntimeException());
        } catch (Exception e) {
            log.error("Error validating user", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Internal server error: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    /**
     * Get user details by ID
     */
    @Override
    public void getUser(GetUserRequest request, StreamObserver<GetUserResponse> responseObserver) {
        try {
            log.debug("gRPC GetUser called: userId={}", request.getUserId());

            UUID userId = parseUserId(request.getUserId());
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException(userId));

            GetUserResponse response = GetUserResponse.newBuilder()
                    .setUser(mapToUserInfo(user))
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (IllegalArgumentException e) {
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription("Invalid user ID format")
                    .asRuntimeException());
        } catch (UserNotFoundException e) {
            responseObserver.onError(Status.NOT_FOUND
                    .withDescription("User not found")
                    .asRuntimeException());
        } catch (Exception e) {
            log.error("Error fetching user", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Internal server error")
                    .asRuntimeException());
        }
    }

    /**
     * Check if transaction amount is within user's limits
     */
    @Override
    public void checkTransactionLimit(CheckLimitRequest request, StreamObserver<CheckLimitResponse> responseObserver) {
        try {
            log.debug("gRPC CheckTransactionLimit called: userId={}, amount={}, type={}", 
                    request.getUserId(), request.getAmountCents(), request.getTransactionType());

            UUID userId = parseUserId(request.getUserId());
            
            // Verify user exists
            if (!userRepository.existsById(userId)) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("User not found")
                        .asRuntimeException());
                return;
            }

            // Check limits using existing service
            LimitCheckResponse limitCheck = limitService.checkTransactionAllowed(
                    userId, 
                    request.getAmountCents(), 
                    request.getTransactionType()
            );

            CheckLimitResponse response = CheckLimitResponse.newBuilder()
                    .setAllowed(limitCheck.allowed())
                    .setReason(limitCheck.reason() != null ? limitCheck.reason() : "")
                    .setRemainingLimitCents(limitCheck.remainingLimitCents())
                    .setDailyLimitCents(0L) // Will be populated if needed
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (IllegalArgumentException e) {
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription("Invalid request: " + e.getMessage())
                    .asRuntimeException());
        } catch (Exception e) {
            log.error("Error checking transaction limit", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Internal server error")
                    .asRuntimeException());
        }
    }

    /**
     * Get user's KYC status and tier limits
     */
    @Override
    public void getKycStatus(GetKycStatusRequest request, StreamObserver<GetKycStatusResponse> responseObserver) {
        try {
            log.debug("gRPC GetKycStatus called: userId={}", request.getUserId());

            UUID userId = parseUserId(request.getUserId());
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException(userId));

            // Get tier limits
            var limits = transactionLimitRepository.findByTierName(user.getKycTier().name())
                    .orElseThrow(() -> new IllegalStateException("Transaction limits not found for tier: " + user.getKycTier()));

            GetKycStatusResponse response = GetKycStatusResponse.newBuilder()
                    .setKycStatus(user.getKycStatus().name())
                    .setKycTier(user.getKycTier().name())
                    .setDailySendLimitCents(limits.getDailySendLimitCents())
                    .setDailyReceiveLimitCents(limits.getDailyReceiveLimitCents())
                    .setSingleTransactionMaxCents(limits.getSingleTransactionMaxCents())
                    .setCanSendInternational(limits.getCanSendInternational())
                    .setRequires2Fa(false)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (IllegalArgumentException e) {
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription("Invalid user ID format")
                    .asRuntimeException());
        } catch (UserNotFoundException e) {
            responseObserver.onError(Status.NOT_FOUND
                    .withDescription("User not found")
                    .asRuntimeException());
        } catch (Exception e) {
            log.error("Error fetching KYC status", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Internal server error")
                    .asRuntimeException());
        }
    }

    /**
     * Record transaction in daily usage table
     * Called by Payment Service after successful transaction
     */
    @Override
    public void recordTransaction(RecordTransactionRequest request, StreamObserver<RecordTransactionResponse> responseObserver) {
        try {
            log.info("gRPC RecordTransaction called: userId={}, amount={}, type={}, txnId={}", 
                    request.getUserId(), request.getAmountCents(), 
                    request.getTransactionType(), request.getTransactionId());

            UUID userId = parseUserId(request.getUserId());
            
            // Verify user exists
            if (!userRepository.existsById(userId)) {
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("User not found")
                        .asRuntimeException());
                return;
            }

            // Update daily usage (thread-safe UPSERT)
            LocalDate today = LocalDate.now();
            if ("send".equalsIgnoreCase(request.getTransactionType())) {
                dailyUsageRepository.incrementSentAmount(userId, today, request.getAmountCents());
            } else if ("receive".equalsIgnoreCase(request.getTransactionType())) {
                dailyUsageRepository.incrementReceivedAmount(userId, today, request.getAmountCents());
            }

            RecordTransactionResponse response = RecordTransactionResponse.newBuilder()
                    .setSuccess(true)
                    .setMessage("Transaction recorded successfully")
                    .build();

            log.info("Transaction recorded: userId={}, txnId={}", userId, request.getTransactionId());
            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (IllegalArgumentException e) {
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription("Invalid request: " + e.getMessage())
                    .asRuntimeException());
        } catch (Exception e) {
            log.error("Error recording transaction", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Failed to record transaction: " + e.getMessage())
                    .asRuntimeException());
        }
    }

    // =====================================================
    // HELPER METHODS
    // =====================================================

    private UUID parseUserId(String userIdStr) {
        try {
            return UUID.fromString(userIdStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format: " + userIdStr);
        }
    }

    private String buildUserCannotTransactReason(User user) {
        if (!user.getIsActive()) {
            return "User account is inactive";
        }
        if (user.getIsSuspended()) {
            return "User account is suspended";
        }
        if (user.getKycStatus() != com.xupay.user.entity.enums.KycStatus.APPROVED) {
            return "KYC verification not approved (current status: " + user.getKycStatus() + ")";
        }
        return "User cannot transact";
    }

    private UserInfo mapToUserInfo(User user) {
        return UserInfo.newBuilder()
                .setUserId(user.getId().toString())
                .setEmail(user.getEmail())
                .setFirstName(user.getFirstName() != null ? user.getFirstName() : "")
                .setLastName(user.getLastName() != null ? user.getLastName() : "")
                .setPhone(user.getPhone() != null ? user.getPhone() : "")
                .setKycStatus(user.getKycStatus().name())
                .setKycTier(user.getKycTier().name())
                .setIsActive(user.getIsActive())
                .setIsSuspended(user.getIsSuspended())
                .setFraudScore(user.getFraudScore())
                .build();
    }
}

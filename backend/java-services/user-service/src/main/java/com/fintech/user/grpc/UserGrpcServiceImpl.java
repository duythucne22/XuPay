package com.fintech.user.grpc;

import com.fintech.user.mapper.UserProtoMapper;
import com.fintech.user.service.UserService;
import com.fintech.user.service.UserService.UserValidation;
import com.fintech.user.v1.*;
import com.google.protobuf.Empty;
import com.google.protobuf.Timestamp;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

@GrpcService
@RequiredArgsConstructor
@Slf4j
public class UserGrpcServiceImpl extends UserServiceGrpc.UserServiceImplBase {
    
    private final UserService userService;
    private final UserProtoMapper protoMapper;
    
    /**
     * Validate users - Called by Payment Service before processing payments.
     */
    @Override
    public void validateUsers(
            ValidateUsersRequest request,
            StreamObserver<ValidateUsersResponse> responseObserver) {
        
        String traceId = request.getTraceId();
        log.info("[{}] ValidateUsers: {} user IDs", traceId, request.getUserIdsList().size());
        
        try {
            Map<String, UserValidation> validations = 
                userService.validateUsers(request.getUserIdsList());
            
            boolean allValid = validations.values().stream()
                .allMatch(v -> v.isValid);
            
            ValidateUsersResponse.Builder responseBuilder = 
                ValidateUsersResponse.newBuilder()
                    .setAllValid(allValid);
            
            for (Map.Entry<String, UserValidation> entry : validations.entrySet()) {
                UserValidation v = entry.getValue();
                
                com.fintech.user.v1.UserValidation validation = com.fintech.user.v1.UserValidation.newBuilder()
                    .setIsValid(v.isValid)
                    .setIsAccountActive(v.isAccountActive)
                    .setIsKycApproved(v.isKycApproved)
                    .setFailureReason(v.failureReason != null ? v.failureReason : "")
                    .build();
                
                responseBuilder.putValidations(entry.getKey(), validation);
            }
            
            responseObserver.onNext(responseBuilder.build());
            responseObserver.onCompleted();
            
            log.info("[{}] ValidateUsers completed: all_valid={}", traceId, allValid);
            
        } catch (Exception e) {
            log.error("[{}] ValidateUsers error: {}", traceId, e.getMessage(), e);
            responseObserver.onError(
                Status.INTERNAL
                    .withDescription("Failed to validate users: " + e.getMessage())
                    .asException()
            );
        }
    }
    
    /**
     * Get user details by ID.
     */
    @Override
    public void getUser(
            GetUserRequest request,
            StreamObserver<UserResponse> responseObserver) {
        
        String traceId = request.getTraceId();
        log.info("[{}] GetUser: {}", traceId, request.getUserId());
        
        try {
            var user = userService.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            UserResponse response = protoMapper.toProto(user);
            responseObserver.onNext(response);
            responseObserver.onCompleted();
            
            log.info("[{}] GetUser completed: {}", traceId, request.getUserId());
            
        } catch (RuntimeException e) {
            log.warn("[{}] GetUser not found: {}", traceId, request.getUserId());
            responseObserver.onError(
                Status.NOT_FOUND
                    .withDescription("User not found: " + request.getUserId())
                    .asException()
            );
        } catch (Exception e) {
            log.error("[{}] GetUser error: {}", traceId, e.getMessage(), e);
            responseObserver.onError(
                Status.INTERNAL
                    .withDescription("Failed to get user: " + e.getMessage())
                    .asException()
            );
        }
    }
    
    /**
     * Get KYC status for a user.
     */
    @Override
    public void getUserKYCStatus(
            GetUserRequest request,
            StreamObserver<UserKYCResponse> responseObserver) {
        
        String traceId = request.getTraceId();
        log.info("[{}] GetUserKYCStatus: {}", traceId, request.getUserId());
        
        try {
            var user = userService.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            UserKYCResponse response = UserKYCResponse.newBuilder()
                .setUserId(user.getId().toString())
                .setKycStatus(user.getKycStatus())
                .setIsVerified("approved".equals(user.getKycStatus()))
                .setVerifiedAt(toTimestamp(user.getKycVerifiedAt()))
                .build();
            
            responseObserver.onNext(response);
            responseObserver.onCompleted();
            
        } catch (RuntimeException e) {
            responseObserver.onError(
                Status.NOT_FOUND
                    .withDescription("User not found")
                    .asException()
            );
        }
    }
    
    /**
     * Health check endpoint.
     */
    @Override
    public void health(
            Empty request,
            StreamObserver<HealthCheckResponse> responseObserver) {
        
        HealthCheckResponse response = HealthCheckResponse.newBuilder()
            .setStatus("SERVING")
            .setVersion("1.0.0")
            .setTimestamp(toTimestamp(LocalDateTime.now()))
            .putDetails("service", "user-service")
            .putDetails("grpc_port", "50053")
            .build();
        
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
    
    private Timestamp toTimestamp(LocalDateTime dateTime) {
        if (dateTime == null) {
            return Timestamp.getDefaultInstance();
        }
        Instant instant = dateTime.atZone(ZoneId.systemDefault()).toInstant();
        return Timestamp.newBuilder()
            .setSeconds(instant.getEpochSecond())
            .setNanos(instant.getNano())
            .build();
    }
}
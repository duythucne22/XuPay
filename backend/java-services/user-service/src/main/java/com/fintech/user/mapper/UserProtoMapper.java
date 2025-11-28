package com.fintech.user.mapper;

import com.fintech.user.model.User;
import com.fintech.user.v1.UserResponse;
import com.google.protobuf.Timestamp;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class UserProtoMapper {
    
    /**
     * Convert User entity to UserResponse protobuf message
     */
    public UserResponse toProto(User user) {
        return UserResponse.newBuilder()
            .setId(user.getId().toString())
            .setEmail(user.getEmail())
            .setFirstName(user.getFirstName() != null ? user.getFirstName() : "")
            .setLastName(user.getLastName() != null ? user.getLastName() : "")
            .setPhoneNumber(user.getPhoneNumber() != null ? user.getPhoneNumber() : "")
            .setKycStatus(user.getKycStatus())
            .setAccountStatus(user.getAccountStatus())
            .setIsEmailVerified(user.getIsEmailVerified())
            .setCreatedAt(toTimestamp(user.getAccountCreatedAt()))
            .setUpdatedAt(toTimestamp(user.getAccountUpdatedAt()))
            .setKycVerifiedAt(toTimestamp(user.getKycVerifiedAt()))
            .build();
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

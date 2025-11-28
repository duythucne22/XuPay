package com.fintech.user.mapper;

import com.fintech.user.dto.UserDTO;
import com.fintech.user.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserDTOMapper {
    
    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }
        
        return UserDTO.builder()
            .id(user.getId().toString())
            .email(user.getEmail())
            .phoneNumber(user.getPhoneNumber())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .kycStatus(user.getKycStatus())
            .accountStatus(user.getAccountStatus())
            .isEmailVerified(user.getIsEmailVerified())
            .createdAt(user.getAccountCreatedAt())
            .updatedAt(user.getAccountUpdatedAt())
            .kycVerifiedAt(user.getKycVerifiedAt())
            .build();
    }
}
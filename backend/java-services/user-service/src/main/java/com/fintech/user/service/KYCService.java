package com.fintech.user.service;

import com.fintech.user.exception.UserNotFoundException;
import com.fintech.user.model.User;
import com.fintech.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class KYCService {
    
    private final UserRepository userRepository;
    
    /**
     * Submit KYC documents for review
     */
    @Transactional
    public User submitKYC(String userId, String documentHash) {
        log.info("Submitting KYC for user: {}", userId);
        
        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        // Update KYC status to needs_review (waiting for review)
        user.setKycStatus("needs_review");
        user.setKycDocumentHash(documentHash);
        
        User savedUser = userRepository.save(user);
        log.info("KYC submitted for user: {}, status: {}", userId, savedUser.getKycStatus());
        
        return savedUser;
    }
    
    /**
     * Approve KYC for a user
     */
    @Transactional
    public User approveKYC(String userId) {
        log.info("Approving KYC for user: {}", userId);
        
        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        user.setKycStatus("approved");
        user.setKycVerifiedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        log.info("KYC approved for user: {}", userId);
        
        return savedUser;
    }
    
    /**
     * Reject KYC for a user
     */
    @Transactional
    public User rejectKYC(String userId, String reason) {
        log.info("Rejecting KYC for user: {}, reason: {}", userId, reason);
        
        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        user.setKycStatus("rejected");
        
        User savedUser = userRepository.save(user);
        log.info("KYC rejected for user: {}", userId);
        
        return savedUser;
    }
    
    /**
     * Get KYC status for a user
     */
    public String getKYCStatus(String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));
        
        return user.getKycStatus();
    }
}
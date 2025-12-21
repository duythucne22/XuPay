package com.xupay.user.service.impl;

import com.xupay.user.dto.request.ApproveKycRequest;
import com.xupay.user.dto.request.RejectKycRequest;
import com.xupay.user.dto.request.UploadKycDocumentRequest;
import com.xupay.user.dto.response.KycDocumentResponse;
import com.xupay.user.entity.KycDocument;
import com.xupay.user.entity.User;
import com.xupay.user.entity.enums.KycTier;
import com.xupay.user.exception.KycDocumentNotFoundException;
import com.xupay.user.exception.UserNotFoundException;
import com.xupay.user.mapper.KycDocumentMapper;
import com.xupay.user.repository.KycDocumentRepository;
import com.xupay.user.repository.UserRepository;
import com.xupay.user.service.KycService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * KycServiceImpl
 * Implementation of KYC document management and verification workflow.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KycServiceImpl implements KycService {

    private final KycDocumentRepository kycDocumentRepository;
    private final UserRepository userRepository;
    private final KycDocumentMapper kycDocumentMapper;

    private static final int DOCUMENT_EXPIRY_YEARS = 2;

    @Override
    @Transactional
    public KycDocumentResponse uploadDocument(UUID userId, UploadKycDocumentRequest request) {
        log.info("User {} uploading KYC document type: {}", userId, request.documentType());
        
        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // Create KYC document
        KycDocument document = KycDocument.builder()
                .user(user)
                .documentType(request.documentType())
                .documentNumber(request.documentNumber())
                .documentCountry(request.documentCountry())
                .fileUrl(request.fileUrl())
                .mimeType(request.mimeType())
                .fileSizeBytes(request.fileSizeBytes())
                .verificationStatus("pending")
                .expiresAt(OffsetDateTime.now().plusYears(DOCUMENT_EXPIRY_YEARS))
                .build();

        KycDocument saved = kycDocumentRepository.save(document);
        log.info("KYC document uploaded successfully: {}", saved.getId());

        return kycDocumentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public KycDocumentResponse approveDocument(UUID documentId, UUID adminId, ApproveKycRequest request) {
        log.info("Admin {} approving KYC document: {}", adminId, documentId);
        
        KycDocument document = kycDocumentRepository.findById(documentId)
                .orElseThrow(() -> new KycDocumentNotFoundException(documentId));

        // Approve document
        document.approve(adminId, request.verificationNotes());

        // Update user KYC status
        User user = document.getUser();
        if (user.isPending()) {
            KycTier tierToApprove = request.upgradeTier() != null ? request.upgradeTier() : KycTier.TIER_1;
            user.approveKyc(tierToApprove, adminId);
            userRepository.save(user);
            log.info("User {} KYC approved with tier: {}", user.getId(), tierToApprove);
        }

        KycDocument saved = kycDocumentRepository.save(document);
        log.info("KYC document approved: {}", documentId);

        return kycDocumentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public KycDocumentResponse rejectDocument(UUID documentId, UUID adminId, RejectKycRequest request) {
        log.info("Admin {} rejecting KYC document: {}", adminId, documentId);
        
        KycDocument document = kycDocumentRepository.findById(documentId)
                .orElseThrow(() -> new KycDocumentNotFoundException(documentId));

        // Reject document
        document.reject(adminId, request.verificationNotes());

        // Update user KYC status
        User user = document.getUser();
        if (user.isPending()) {
            user.rejectKyc();
            userRepository.save(user);
            log.info("User {} KYC rejected", user.getId());
        }

        KycDocument saved = kycDocumentRepository.save(document);
        log.info("KYC document rejected: {}", documentId);

        return kycDocumentMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public KycDocumentResponse getDocumentById(UUID documentId) {
        log.debug("Fetching KYC document: {}", documentId);
        
        KycDocument document = kycDocumentRepository.findById(documentId)
                .orElseThrow(() -> new KycDocumentNotFoundException(documentId));

        return kycDocumentMapper.toResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KycDocumentResponse> getUserDocuments(UUID userId) {
        log.debug("Fetching KYC documents for user: {}", userId);
        
        List<KycDocument> documents = kycDocumentRepository.findByUserId(userId);
        return kycDocumentMapper.toResponseList(documents);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KycDocumentResponse> getPendingDocuments() {
        log.debug("Fetching pending KYC documents for admin queue");
        
        List<KycDocument> documents = kycDocumentRepository
                .findByVerificationStatusOrderByCreatedAtAsc("pending");
        
        return kycDocumentMapper.toResponseList(documents);
    }

    @Override
    @Transactional
    public void checkExpiredDocuments() {
        log.info("Checking for expired KYC documents");
        
        List<KycDocument> expiredDocs = kycDocumentRepository.findExpiredDocuments(OffsetDateTime.now());
        
        for (KycDocument doc : expiredDocs) {
            if (doc.isPending() || doc.isApproved()) {
                doc.setVerificationStatus("expired");
                log.info("Marked KYC document {} as expired", doc.getId());
            }
        }
        
        if (!expiredDocs.isEmpty()) {
            kycDocumentRepository.saveAll(expiredDocs);
            log.info("Marked {} documents as expired", expiredDocs.size());
        }
    }
}

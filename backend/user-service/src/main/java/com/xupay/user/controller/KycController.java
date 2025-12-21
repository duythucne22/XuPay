package com.xupay.user.controller;

import com.xupay.user.dto.request.ApproveKycRequest;
import com.xupay.user.dto.request.RejectKycRequest;
import com.xupay.user.dto.request.UploadKycDocumentRequest;
import com.xupay.user.dto.response.KycDocumentResponse;
import com.xupay.user.service.KycService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

/**
 * KycController
 * REST API for KYC document management and verification workflow.
 */
@RestController
@RequestMapping("/api/kyc")
@RequiredArgsConstructor
@Slf4j
public class KycController {

    private final KycService kycService;

    /**
     * Upload a new KYC document.
     * POST /api/kyc/upload-document
     */
    @PostMapping("/upload-document")
    public ResponseEntity<KycDocumentResponse> uploadDocument(
            @Valid @RequestBody UploadKycDocumentRequest request,
            Principal principal) {
        log.info("User {} uploading KYC document of type {}", principal.getName(), request.documentType());
        
        UUID userId = UUID.fromString(principal.getName());
        KycDocumentResponse response = kycService.uploadDocument(userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all KYC documents for authenticated user.
     * GET /api/kyc/documents
     */
    @GetMapping("/documents")
    public ResponseEntity<List<KycDocumentResponse>> getMyDocuments(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        log.debug("User {} fetching their KYC documents", userId);
        
        List<KycDocumentResponse> documents = kycService.getUserDocuments(userId);
        return ResponseEntity.ok(documents);
    }

    /**
     * Get specific KYC document by ID.
     * GET /api/kyc/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<KycDocumentResponse> getDocument(
            @PathVariable UUID id,
            Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        log.debug("User {} fetching document {}", userId, id);
        
        KycDocumentResponse document = kycService.getDocumentById(id);
        
        // Security check: Only owner or admin can view
        if (!document.userId().equals(userId)) {
            log.warn("User {} attempted to access document {} owned by {}", userId, id, document.userId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(document);
    }

    /**
     * Get pending KYC documents (admin only).
     * GET /api/kyc/pending
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<KycDocumentResponse>> getPendingDocuments() {
        log.debug("Admin fetching pending KYC documents");
        
        List<KycDocumentResponse> pending = kycService.getPendingDocuments();
        return ResponseEntity.ok(pending);
    }

    /**
     * Approve a KYC document (admin only).
     * POST /api/kyc/{id}/approve
     */
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KycDocumentResponse> approveDocument(
            @PathVariable UUID id,
            @Valid @RequestBody ApproveKycRequest request,
            Principal principal) {
        UUID adminId = UUID.fromString(principal.getName());
        log.info("Admin {} approving KYC document {}", adminId, id);
        
        KycDocumentResponse response = kycService.approveDocument(id, adminId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Reject a KYC document (admin only).
     * POST /api/kyc/{id}/reject
     */
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KycDocumentResponse> rejectDocument(
            @PathVariable UUID id,
            @Valid @RequestBody RejectKycRequest request,
            Principal principal) {
        UUID adminId = UUID.fromString(principal.getName());
        log.info("Admin {} rejecting KYC document {}", adminId, id);
        
        KycDocumentResponse response = kycService.rejectDocument(id, adminId, request);
        return ResponseEntity.ok(response);
    }
}

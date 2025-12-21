package com.xupay.user.service;

import com.xupay.user.dto.request.ApproveKycRequest;
import com.xupay.user.dto.request.RejectKycRequest;
import com.xupay.user.dto.request.UploadKycDocumentRequest;
import com.xupay.user.dto.response.KycDocumentResponse;

import java.util.List;
import java.util.UUID;

/**
 * KycService
 * Business logic for KYC document management and verification workflow.
 */
public interface KycService {

    /**
     * Upload a new KYC document
     * @param userId User uploading the document
     * @param request Document details
     * @return Created document response
     * @throws com.xupay.user.exception.UserNotFoundException if user not found
     */
    KycDocumentResponse uploadDocument(UUID userId, UploadKycDocumentRequest request);

    /**
     * Approve a KYC document (Admin only)
     * @param documentId Document to approve
     * @param adminId Admin performing approval
     * @param request Approval details (notes, tier upgrade)
     * @return Updated document response
     * @throws com.xupay.user.exception.KycDocumentNotFoundException if document not found
     */
    KycDocumentResponse approveDocument(UUID documentId, UUID adminId, ApproveKycRequest request);

    /**
     * Reject a KYC document (Admin only)
     * @param documentId Document to reject
     * @param adminId Admin performing rejection
     * @param request Rejection details (reason)
     * @return Updated document response
     * @throws com.xupay.user.exception.KycDocumentNotFoundException if document not found
     */
    KycDocumentResponse rejectDocument(UUID documentId, UUID adminId, RejectKycRequest request);

    /**
     * Get a specific KYC document by ID
     * @param documentId Document ID
     * @return Document response
     * @throws com.xupay.user.exception.KycDocumentNotFoundException if document not found
     */
    KycDocumentResponse getDocumentById(UUID documentId);

    /**
     * Get all KYC documents for a user
     * @param userId User ID
     * @return List of user's documents
     */
    List<KycDocumentResponse> getUserDocuments(UUID userId);

    /**
     * Get all pending KYC documents (Admin queue)
     * @return List of pending documents
     */
    List<KycDocumentResponse> getPendingDocuments();

    /**
     * Check for expired documents and mark them
     * (Can be called by scheduled job)
     */
    void checkExpiredDocuments();
}

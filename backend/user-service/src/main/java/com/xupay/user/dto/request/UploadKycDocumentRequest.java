package com.xupay.user.dto.request;

import com.xupay.user.entity.enums.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * UploadKycDocumentRequest
 * Request DTO for uploading a KYC identity document.
 */
public record UploadKycDocumentRequest(
    
    @NotNull(message = "Document type is required")
    DocumentType documentType,
    
    @Size(max = 100, message = "Document number must not exceed 100 characters")
    String documentNumber,
    
    @Size(min = 3, max = 3, message = "Document country must be 3-character ISO code")
    String documentCountry,
    
    @NotBlank(message = "File URL is required")
    @Size(max = 500, message = "File URL must not exceed 500 characters")
    String fileUrl,
    
    @NotBlank(message = "MIME type is required")
    @Size(max = 100, message = "MIME type must not exceed 100 characters")
    String mimeType,
    
    @NotNull(message = "File size is required")
    @Positive(message = "File size must be positive")
    Long fileSizeBytes
) {}

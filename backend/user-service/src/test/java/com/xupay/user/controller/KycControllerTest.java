package com.xupay.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xupay.user.dto.request.ApproveKycRequest;
import com.xupay.user.dto.request.RejectKycRequest;
import com.xupay.user.dto.request.UploadKycDocumentRequest;
import com.xupay.user.dto.response.KycDocumentResponse;
import com.xupay.user.entity.enums.DocumentType;
import com.xupay.user.service.JwtService;
import com.xupay.user.service.KycService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.security.Principal; // Import Principal
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(KycController.class)
@AutoConfigureMockMvc(addFilters = false)
class KycControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private KycService kycService;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private JpaMetamodelMappingContext jpaMappingContext;

    private final UUID testUserId = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private final UUID testDocId = UUID.fromString("22222222-2222-2222-2222-222222222222");
    // FIX: Valid UUID for admin
    private final UUID adminId = UUID.fromString("99999999-9999-9999-9999-999999999999"); 

    // Helper to simulate the authenticated user (Principal)
    private final Principal mockPrincipal = () -> testUserId.toString();
    private final Principal mockAdminPrincipal = () -> adminId.toString();

    @Test
    @DisplayName("POST /api/kyc/upload-document - Should upload KYC document")
    void uploadDocument_shouldReturnCreatedDocument() throws Exception {
        UploadKycDocumentRequest request = new UploadKycDocumentRequest(
            DocumentType.PASSPORT, "P1234567", "USA",
            "https://s3.amazonaws.com/bucket/passport.jpg", "image/jpeg", 1024000L
        );

        KycDocumentResponse response = new KycDocumentResponse(
            testDocId, testUserId, DocumentType.PASSPORT, "P1234567", "USA",
            "https://s3.amazonaws.com/bucket/passport.jpg", "PENDING",
            null, null, null, null, OffsetDateTime.now()
        );

        when(kycService.uploadDocument(eq(testUserId), any(UploadKycDocumentRequest.class)))
            .thenReturn(response);

        mockMvc.perform(post("/api/kyc/upload-document")
                .principal(mockPrincipal) // FIX 500: Inject Principal
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(testDocId.toString()));
    }

    @Test
    @DisplayName("GET /api/kyc/documents - Should return all user documents")
    void getMyDocuments_shouldReturnDocumentList() throws Exception {
        KycDocumentResponse doc1 = new KycDocumentResponse(
            UUID.randomUUID(), testUserId, DocumentType.PASSPORT, "P1234567", "USA",
            "https://s3.amazonaws.com/bucket/passport.jpg", "APPROVED",
            null, null, null, null, OffsetDateTime.now()
        );

        KycDocumentResponse doc2 = new KycDocumentResponse(
            UUID.randomUUID(), testUserId, DocumentType.UTILITY_BILL, null, "USA",
            "https://s3.amazonaws.com/bucket/bill.pdf", "PENDING",
            null, null, null, null, OffsetDateTime.now()
        );

        when(kycService.getUserDocuments(testUserId)).thenReturn(Arrays.asList(doc1, doc2));

        mockMvc.perform(get("/api/kyc/documents")
                .principal(mockPrincipal)) // FIX 500
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("GET /api/kyc/{id} - Should return specific document")
    void getDocument_shouldReturnDocument() throws Exception {
        KycDocumentResponse response = new KycDocumentResponse(
            testDocId, testUserId, DocumentType.PASSPORT, "P1234567", "USA",
            "https://s3.amazonaws.com/bucket/passport.jpg", "APPROVED",
            "Document is valid", UUID.randomUUID(), OffsetDateTime.now(),
            OffsetDateTime.now().plusYears(5), OffsetDateTime.now().minusDays(1)
        );

        when(kycService.getDocumentById(testDocId)).thenReturn(response);

        mockMvc.perform(get("/api/kyc/" + testDocId)
                .principal(mockPrincipal)) // FIX 500
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(testDocId.toString()));
    }

    @Test
    @DisplayName("GET /api/kyc/{id} - Should return forbidden for other user's document")
    void getDocument_shouldReturnForbiddenForOtherUser() throws Exception {
        // Arrange: Use a DIFFERENT user ID for the "other" user
        UUID otherUserId = UUID.fromString("33333333-3333-3333-3333-333333333333");
        
        KycDocumentResponse response = new KycDocumentResponse(
            testDocId, testUserId, // Document belongs to testUserId
            DocumentType.PASSPORT, "P1234567", "USA",
            "https://s3.amazonaws.com/bucket/passport.jpg", "APPROVED",
            null, null, null, null, OffsetDateTime.now()
        );

        when(kycService.getDocumentById(testDocId)).thenReturn(response);

        // Act: Request as "otherUserId" (Principal) trying to access "testUserId" doc
        mockMvc.perform(get("/api/kyc/" + testDocId)
                .principal(() -> otherUserId.toString())) // Simulate logging in as someone else
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/kyc/pending - Should return pending documents for admin")
    @WithMockUser(username = "admin-id", roles = {"ADMIN"}) // Note: roles usually need filters=true to work automatically
    void getPendingDocuments_shouldReturnPendingList() throws Exception {
        KycDocumentResponse doc1 = new KycDocumentResponse(
            UUID.randomUUID(), UUID.randomUUID(), DocumentType.PASSPORT, "P1234567", "USA",
            "https://s3.amazonaws.com/bucket/passport1.jpg", "PENDING",
            null, null, null, null, OffsetDateTime.now()
        );

        when(kycService.getPendingDocuments()).thenReturn(Arrays.asList(doc1));

        mockMvc.perform(get("/api/kyc/pending")
                .principal(mockAdminPrincipal)) // Inject admin principal
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("POST /api/kyc/{id}/approve - Should approve document")
    void approveDocument_shouldReturnApprovedDocument() throws Exception {
        ApproveKycRequest request = new ApproveKycRequest("Document verified", null);

        KycDocumentResponse response = new KycDocumentResponse(
            testDocId, testUserId, DocumentType.PASSPORT, "P1234567", "USA",
            "https://s3.amazonaws.com/bucket/passport.jpg", "APPROVED",
            "Document verified", adminId, OffsetDateTime.now(),
            OffsetDateTime.now().plusYears(5), OffsetDateTime.now()
        );

        // FIX: Match any UUID for adminId in the service call
        when(kycService.approveDocument(eq(testDocId), any(UUID.class), any(ApproveKycRequest.class)))
            .thenReturn(response);

        mockMvc.perform(post("/api/kyc/" + testDocId + "/approve")
                .principal(mockAdminPrincipal)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.verificationStatus").value("APPROVED"));
    }

    @Test
    @DisplayName("POST /api/kyc/{id}/reject - Should reject document")
    void rejectDocument_shouldReturnRejectedDocument() throws Exception {
        RejectKycRequest request = new RejectKycRequest("Blurry");

        KycDocumentResponse response = new KycDocumentResponse(
            testDocId, testUserId, DocumentType.PASSPORT, "P1234567", "USA",
            "https://s3.amazonaws.com/bucket/passport.jpg", "REJECTED",
            "Blurry", adminId, OffsetDateTime.now(),
            null, OffsetDateTime.now()
        );

        // FIX: Match any UUID for adminId
        when(kycService.rejectDocument(eq(testDocId), any(UUID.class), any(RejectKycRequest.class)))
            .thenReturn(response);

        mockMvc.perform(post("/api/kyc/" + testDocId + "/reject")
                .principal(mockAdminPrincipal)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.verificationStatus").value("REJECTED"));
    }
}
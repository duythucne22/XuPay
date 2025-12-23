/**
 * KYC API Client
 * Handles all KYC verification API calls
 * TODO: Replace mock data with actual backend API endpoints
 */

import {
  KYCProfile,
  KYCDocument,
  KYCLimits,
  KYCSummary,
  VerificationEvent,
  SelfieVerification,
  AddressVerification,
  PaginatedResponse,
  ApiResponse,
  KYCFilters,
  KYCEventFilters,
} from '@/types/kyc';

import {
  MOCK_KYC_PROFILE_VERIFIED,
  MOCK_KYC_PROFILE_PENDING,
  MOCK_KYC_PROFILE_UNVERIFIED,
  MOCK_KYC_DOCUMENTS,
  MOCK_KYC_LIMITS,
  MOCK_VERIFICATION_EVENTS,
  MOCK_SELFIE_VERIFICATION,
  MOCK_ADDRESS_VERIFICATION,
  MOCK_KYC_SUMMARY_VERIFIED,
  MOCK_KYC_SUMMARY_PENDING,
  generatePaginatedDocuments,
  generatePaginatedEvents,
} from '@/mocks/kyc';

/**
 * Simulated API latency (ms)
 */
const API_LATENCY = 300;

/**
 * KYC API Client
 */
class KYCApiClient {
  private latency = API_LATENCY;

  /**
   * Simulate network latency
   */
  private async delay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.latency));
  }

  /**
   * Get user KYC profile
   * TODO: GET /api/v1/kyc/profile
   */
  async getProfile(userId?: string): Promise<KYCProfile> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/v1/kyc/profile${userId ? `?userId=${userId}` : ''}`);
    
    // Mock: Return verified profile
    return MOCK_KYC_PROFILE_VERIFIED;
  }

  /**
   * Get KYC summary (complete verification info)
   * TODO: GET /api/v1/kyc/summary
   */
  async getSummary(userId?: string): Promise<KYCSummary> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/v1/kyc/summary${userId ? `?userId=${userId}` : ''}`);
    
    // Mock: Return verified summary
    return MOCK_KYC_SUMMARY_VERIFIED;
  }

  /**
   * Get all KYC documents for user
   * TODO: GET /api/v1/kyc/documents
   */
  async getDocuments(filters?: KYCFilters): Promise<PaginatedResponse<KYCDocument>> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const params = new URLSearchParams();
    // if (filters?.status) params.append('status', filters.status);
    // if (filters?.documentType) params.append('type', filters.documentType);
    // const response = await fetch(`/api/v1/kyc/documents?${params}`);
    
    const offset = filters?.offset ?? 0;
    const limit = filters?.limit ?? 10;
    
    let documents = [...MOCK_KYC_DOCUMENTS];
    
    // Client-side filtering
    if (filters?.status) {
      documents = documents.filter(doc => doc.status === filters.status);
    }
    if (filters?.documentType) {
      documents = documents.filter(doc => doc.type === filters.documentType);
    }
    
    // Sort by upload date
    documents.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    
    return {
      data: documents.slice(offset, offset + limit),
      total: documents.length,
      offset,
      limit,
    };
  }

  /**
   * Get single document by ID
   * TODO: GET /api/v1/kyc/documents/:id
   */
  async getDocument(documentId: string): Promise<KYCDocument> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/v1/kyc/documents/${documentId}`);
    
    const document = MOCK_KYC_DOCUMENTS.find(doc => doc.id === documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }
    
    return document;
  }

  /**
   * Upload new KYC document
   * TODO: POST /api/v1/kyc/documents/upload
   */
  async uploadDocument(file: File, documentType: string): Promise<KYCDocument> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('type', documentType);
    // const response = await fetch('/api/v1/kyc/documents/upload', {
    //   method: 'POST',
    //   body: formData,
    // });
    
    // Mock: Create new document
    const newDocument: KYCDocument = {
      id: `doc_${Date.now()}`,
      userId: 'current_user',
      type: documentType as any,
      status: 'reviewing',
      fileName: file.name,
      fileSize: file.size,
      fileUrl: `/uploads/kyc/doc_${Date.now()}`,
      mimeType: file.type,
      uploadedAt: new Date(),
    };
    
    return newDocument;
  }

  /**
   * Delete document
   * TODO: DELETE /api/v1/kyc/documents/:id
   */
  async deleteDocument(documentId: string): Promise<ApiResponse<void>> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/v1/kyc/documents/${documentId}`, {
    //   method: 'DELETE',
    // });
    
    return {
      data: undefined as any,
      success: true,
      message: `Document ${documentId} deleted`,
    };
  }

  /**
   * Get KYC limits for current tier
   * TODO: GET /api/v1/kyc/limits
   */
  async getLimits(): Promise<KYCLimits> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/v1/kyc/limits');
    
    // Mock: Return advanced tier limits
    return MOCK_KYC_LIMITS[2];
  }

  /**
   * Get limits for specific tier
   * TODO: GET /api/v1/kyc/limits/:tier
   */
  async getLimitsByTier(tier: string): Promise<KYCLimits> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/v1/kyc/limits/${tier}`);
    
    const limits = MOCK_KYC_LIMITS.find(l => l.tier === tier);
    if (!limits) {
      throw new Error(`Limits not found for tier: ${tier}`);
    }
    
    return limits;
  }

  /**
   * Get all KYC limits
   * TODO: GET /api/v1/kyc/limits/all
   */
  async getAllLimits(): Promise<KYCLimits[]> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/v1/kyc/limits/all');
    
    return MOCK_KYC_LIMITS;
  }

  /**
   * Get verification history/events
   * TODO: GET /api/v1/kyc/events
   */
  async getVerificationEvents(filters?: KYCEventFilters): Promise<PaginatedResponse<VerificationEvent>> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const params = new URLSearchParams();
    // if (filters?.eventType) params.append('type', filters.eventType);
    // const response = await fetch(`/api/v1/kyc/events?${params}`);
    
    const offset = filters?.offset ?? 0;
    const limit = filters?.limit ?? 10;
    
    let events = [...MOCK_VERIFICATION_EVENTS];
    
    // Client-side filtering
    if (filters?.eventType) {
      events = events.filter(e => e.type === filters.eventType);
    }
    
    // Sort by date descending
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return {
      data: events.slice(offset, offset + limit),
      total: events.length,
      offset,
      limit,
    };
  }

  /**
   * Start KYC verification
   * TODO: POST /api/v1/kyc/start
   */
  async startVerification(): Promise<ApiResponse<KYCProfile>> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/v1/kyc/start', {
    //   method: 'POST',
    // });
    
    const profile = { ...MOCK_KYC_PROFILE_UNVERIFIED, updatedAt: new Date() };
    
    return {
      data: profile,
      success: true,
      message: 'KYC verification started',
    };
  }

  /**
   * Submit KYC verification
   * TODO: POST /api/v1/kyc/submit
   */
  async submitVerification(documentIds: string[]): Promise<ApiResponse<KYCProfile>> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/v1/kyc/submit', {
    //   method: 'POST',
    //   body: JSON.stringify({ documentIds }),
    // });
    
    const profile = { ...MOCK_KYC_PROFILE_PENDING, status: 'pending' as const, updatedAt: new Date() };
    
    return {
      data: profile,
      success: true,
      message: 'KYC documents submitted for review',
    };
  }

  /**
   * Upload selfie for liveness verification
   * TODO: POST /api/v1/kyc/selfie/upload
   */
  async uploadSelfie(file: File): Promise<SelfieVerification> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await fetch('/api/v1/kyc/selfie/upload', {
    //   method: 'POST',
    //   body: formData,
    // });
    
    const selfie: SelfieVerification = {
      id: `selfie_${Date.now()}`,
      userId: 'current_user',
      imageUrl: URL.createObjectURL(file),
      fileName: file.name,
      uploadedAt: new Date(),
      status: 'pending',
    };
    
    return selfie;
  }

  /**
   * Verify selfie/liveness
   * TODO: POST /api/v1/kyc/selfie/verify
   */
  async verifySelfie(selfieId: string): Promise<SelfieVerification> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/v1/kyc/selfie/${selfieId}/verify`, {
    //   method: 'POST',
    // });
    
    // Mock: Return verified selfie
    return {
      ...MOCK_SELFIE_VERIFICATION,
      id: selfieId,
      status: 'verified',
    };
  }

  /**
   * Verify address document
   * TODO: POST /api/v1/kyc/address/verify
   */
  async verifyAddress(documentId: string): Promise<AddressVerification> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/v1/kyc/address/${documentId}/verify`, {
    //   method: 'POST',
    // });
    
    // Mock: Return verified address
    return {
      ...MOCK_ADDRESS_VERIFICATION,
      uploadedAt: new Date(),
      verifiedAt: new Date(),
    };
  }

  /**
   * Re-submit rejected verification
   * TODO: POST /api/v1/kyc/resubmit
   */
  async resubmitVerification(rejectionId: string, documentIds: string[]): Promise<ApiResponse<KYCProfile>> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/v1/kyc/resubmit', {
    //   method: 'POST',
    //   body: JSON.stringify({ rejectionId, documentIds }),
    // });
    
    const profile = { ...MOCK_KYC_PROFILE_PENDING, status: 'pending' as const, updatedAt: new Date() };
    
    return {
      data: profile,
      success: true,
      message: 'Resubmitted for verification',
    };
  }

  /**
   * Get verification expiry date
   * TODO: GET /api/v1/kyc/expiry
   */
  async getVerificationExpiry(): Promise<{ expiresAt: Date | null }> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/v1/kyc/expiry');
    
    return {
      expiresAt: MOCK_KYC_PROFILE_VERIFIED.expiresAt || null,
    };
  }

  /**
   * Renew expired verification
   * TODO: POST /api/v1/kyc/renew
   */
  async renewVerification(): Promise<ApiResponse<KYCProfile>> {
    await this.delay();
    
    // TODO: Replace with actual API call
    // const response = await fetch('/api/v1/kyc/renew', {
    //   method: 'POST',
    // });
    
    const now = new Date();
    const profile = {
      ...MOCK_KYC_PROFILE_VERIFIED,
      expiresAt: new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 years
      lastVerifiedAt: now,
      updatedAt: now,
    };
    
    return {
      data: profile,
      success: true,
      message: 'Verification renewed successfully',
    };
  }
}

// Export singleton instance
export const kycApi = new KYCApiClient();

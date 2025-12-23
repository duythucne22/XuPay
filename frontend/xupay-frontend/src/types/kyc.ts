/**
 * KYC (Know Your Customer) Types
 * Identity verification, document management, and compliance
 */

/**
 * Verification status levels
 */
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'expired';

/**
 * Document types for KYC
 */
export type DocumentType = 'passport' | 'national_id' | 'driver_license' | 'utility_bill' | 'bank_statement';

/**
 * Document status
 */
export type DocumentStatus = 'uploaded' | 'reviewing' | 'approved' | 'rejected' | 'expired';

/**
 * Verification method
 */
export type VerificationMethod = 'government_id' | 'selfie' | 'address_proof' | 'video_call' | 'third_party';

/**
 * KYC limit tier
 */
export type KYCLimitTier = 'basic' | 'intermediate' | 'advanced' | 'unlimited';

/**
 * User KYC status
 */
export interface KYCProfile {
  userId: string;
  status: VerificationStatus;
  verificationTier: KYCLimitTier;
  
  // Personal info
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nationality: string;
  
  // Address
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Verification details
  verificationMethod?: VerificationMethod;
  verifiedAt?: Date;
  expiresAt?: Date;
  rejectionReason?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastVerifiedAt?: Date;
}

/**
 * Document metadata
 */
export interface KYCDocument {
  id: string;
  userId: string;
  type: DocumentType;
  status: DocumentStatus;
  
  // File info
  fileName: string;
  fileSize: number; // bytes
  fileUrl: string;
  mimeType: string;
  
  // Verification
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // Admin ID
  rejectionReason?: string;
  expiresAt?: Date;
  
  // Recognition (OCR/AI)
  extractedData?: {
    documentNumber?: string;
    issueDate?: Date;
    expiryDate?: Date;
    holder?: string;
  };
}

/**
 * KYC limits per tier
 */
export interface KYCLimits {
  tier: KYCLimitTier;
  dailyTransactionLimit: number; // USD
  monthlyTransactionLimit: number; // USD
  dailyWithdrawalLimit: number; // USD
  maxWalletBalance: number; // USD
  canTransferFunds: boolean;
  canWithdraw: boolean;
  canReceiveTransfers: boolean;
  maxP2PTransferAmount: number; // USD
}

/**
 * Verification event history
 */
export interface VerificationEvent {
  id: string;
  userId: string;
  type: 'verification_started' | 'document_uploaded' | 'verification_completed' | 'verification_failed' | 'tier_upgraded' | 'tier_downgraded' | 'verification_expired';
  
  status: VerificationStatus;
  method?: VerificationMethod;
  
  details: string; // Description of event
  timestamp: Date;
  
  // If rejected
  rejectionReason?: string;
  
  // Admin info if reviewed
  reviewedBy?: string;
  notes?: string;
}

/**
 * Selfie verification data
 */
export interface SelfieVerification {
  id: string;
  userId: string;
  
  // Selfie image
  imageUrl: string;
  fileName: string;
  uploadedAt: Date;
  
  // Facial recognition results
  status: 'pending' | 'verified' | 'failed' | 'manual_review';
  faceLivenessScore?: number; // 0-100
  faceMatchScore?: number; // 0-100 (matches uploaded document)
  
  // Manual review
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
}

/**
 * Address verification
 */
export interface AddressVerification {
  id: string;
  userId: string;
  
  documentType: DocumentType; // e.g., utility_bill
  status: DocumentStatus;
  
  uploadedAt: Date;
  verifiedAt?: Date;
  
  // Extracted address
  extractedAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  // Verification result
  matchesProfile: boolean;
  reviewedBy?: string;
}

/**
 * Video verification
 */
export interface VideoVerification {
  id: string;
  userId: string;
  
  scheduledAt: Date;
  completedAt?: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  
  // Verification details
  verifier?: string; // Verifier ID
  duration?: number; // seconds
  notes?: string;
  
  // Results
  verificationResult?: 'approved' | 'rejected' | 'requires_followup';
  verificationScore?: number; // 0-100
}

/**
 * KYC summary (dashboard display)
 */
export interface KYCSummary {
  profile: KYCProfile;
  documents: KYCDocument[];
  limits: KYCLimits;
  isDocumentExpiringSoon: boolean; // Within 30 days
  nextVerificationDue?: Date;
  
  // Progress
  verificationProgress: number; // 0-100 percentage
  completedSteps: VerificationMethod[];
  remainingSteps: VerificationMethod[];
}

/**
 * KYC rejection details
 */
export interface RejectionDetails {
  documentId?: string;
  reason: string;
  category: 'document_quality' | 'document_expired' | 'identity_mismatch' | 'address_mismatch' | 'fraud_suspected' | 'incomplete_data' | 'other';
  suggestedAction: string;
  canResubmit: boolean;
  resubmitDeadline?: Date;
}

/**
 * Pagination wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * Generic API response
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * KYC filters for querying
 */
export interface KYCFilters {
  offset?: number;
  limit?: number;
  status?: VerificationStatus;
  tier?: KYCLimitTier;
  documentType?: DocumentType;
  dateRange?: string; // e.g., "7d", "30d", "custom"
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

/**
 * KYC event filters
 */
export interface KYCEventFilters {
  offset?: number;
  limit?: number;
  eventType?: VerificationEvent['type'];
  dateRange?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * KYC Mock Data
 * Realistic KYC verification data for development
 */

import {
  KYCProfile,
  KYCDocument,
  KYCLimits,
  VerificationEvent,
  SelfieVerification,
  AddressVerification,
  KYCSummary,
  PaginatedResponse,
} from '@/types/kyc';

// ============================================================================
// KYC Profiles
// ============================================================================

export const MOCK_KYC_PROFILE_UNVERIFIED: KYCProfile = {
  userId: 'user_001',
  status: 'unverified',
  verificationTier: 'basic',
  
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('1990-05-15'),
  nationality: 'US',
  
  street: '123 Main St',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94102',
  country: 'US',
  
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

export const MOCK_KYC_PROFILE_PENDING: KYCProfile = {
  userId: 'user_002',
  status: 'pending',
  verificationTier: 'basic',
  
  firstName: 'Jane',
  lastName: 'Smith',
  dateOfBirth: new Date('1992-08-22'),
  nationality: 'US',
  
  street: '456 Oak Ave',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'US',
  
  verificationMethod: 'government_id',
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-18'),
};

export const MOCK_KYC_PROFILE_VERIFIED: KYCProfile = {
  userId: 'user_003',
  status: 'verified',
  verificationTier: 'advanced',
  
  firstName: 'Michael',
  lastName: 'Johnson',
  dateOfBirth: new Date('1988-03-10'),
  nationality: 'US',
  
  street: '789 Elm St',
  city: 'Austin',
  state: 'TX',
  postalCode: '78701',
  country: 'US',
  
  verificationMethod: 'government_id',
  verifiedAt: new Date('2024-01-05'),
  expiresAt: new Date('2026-01-05'),
  createdAt: new Date('2023-12-15'),
  updatedAt: new Date('2024-01-05'),
  lastVerifiedAt: new Date('2024-01-05'),
};

export const MOCK_KYC_PROFILE_REJECTED: KYCProfile = {
  userId: 'user_004',
  status: 'rejected',
  verificationTier: 'basic',
  
  firstName: 'Sarah',
  lastName: 'Williams',
  dateOfBirth: new Date('1995-11-30'),
  nationality: 'US',
  
  street: '321 Pine Rd',
  city: 'Denver',
  state: 'CO',
  postalCode: '80202',
  country: 'US',
  
  rejectionReason: 'Document expired',
  createdAt: new Date('2024-01-12'),
  updatedAt: new Date('2024-01-17'),
};

// ============================================================================
// KYC Documents
// ============================================================================

export const MOCK_KYC_DOCUMENTS: KYCDocument[] = [
  // Verified document
  {
    id: 'doc_001',
    userId: 'user_003',
    type: 'passport',
    status: 'approved',
    fileName: 'passport_scan.pdf',
    fileSize: 1024000,
    fileUrl: '/uploads/kyc/doc_001.pdf',
    mimeType: 'application/pdf',
    uploadedAt: new Date('2024-01-04'),
    reviewedAt: new Date('2024-01-05'),
    reviewedBy: 'admin_001',
    expiresAt: new Date('2032-06-15'),
    extractedData: {
      documentNumber: 'N1234567',
      issueDate: new Date('2022-06-15'),
      expiryDate: new Date('2032-06-15'),
      holder: 'Michael Johnson',
    },
  },
  
  // Pending review
  {
    id: 'doc_002',
    userId: 'user_002',
    type: 'national_id',
    status: 'reviewing',
    fileName: 'national_id_front.jpg',
    fileSize: 512000,
    fileUrl: '/uploads/kyc/doc_002_front.jpg',
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2024-01-18'),
    extractedData: {
      documentNumber: 'ID987654',
      issueDate: new Date('2020-03-10'),
      expiryDate: new Date('2030-03-10'),
      holder: 'Jane Smith',
    },
  },
  
  // Rejected document
  {
    id: 'doc_003',
    userId: 'user_002',
    type: 'national_id',
    status: 'rejected',
    fileName: 'national_id_back.jpg',
    fileSize: 512000,
    fileUrl: '/uploads/kyc/doc_003_back.jpg',
    mimeType: 'image/jpeg',
    uploadedAt: new Date('2024-01-18'),
    reviewedAt: new Date('2024-01-18'),
    reviewedBy: 'admin_002',
    rejectionReason: 'Document quality too low',
  },
  
  // Address proof
  {
    id: 'doc_004',
    userId: 'user_003',
    type: 'utility_bill',
    status: 'approved',
    fileName: 'utility_bill_2024.pdf',
    fileSize: 768000,
    fileUrl: '/uploads/kyc/doc_004.pdf',
    mimeType: 'application/pdf',
    uploadedAt: new Date('2024-01-04'),
    reviewedAt: new Date('2024-01-04'),
    reviewedBy: 'admin_001',
    expiresAt: new Date('2025-01-04'),
  },
  
  // Expired document
  {
    id: 'doc_005',
    userId: 'user_004',
    type: 'driver_license',
    status: 'expired',
    fileName: 'drivers_license.pdf',
    fileSize: 890000,
    fileUrl: '/uploads/kyc/doc_005.pdf',
    mimeType: 'application/pdf',
    uploadedAt: new Date('2023-12-15'),
    reviewedAt: new Date('2023-12-16'),
    reviewedBy: 'admin_003',
    expiresAt: new Date('2023-12-20'),
    extractedData: {
      documentNumber: 'DL1122334',
      issueDate: new Date('2020-06-01'),
      expiryDate: new Date('2023-12-20'),
      holder: 'Sarah Williams',
    },
  },
];

// ============================================================================
// KYC Limits by Tier
// ============================================================================

export const MOCK_KYC_LIMITS: KYCLimits[] = [
  {
    tier: 'basic',
    dailyTransactionLimit: 500,
    monthlyTransactionLimit: 5000,
    dailyWithdrawalLimit: 100,
    maxWalletBalance: 1000,
    canTransferFunds: true,
    canWithdraw: false,
    canReceiveTransfers: true,
    maxP2PTransferAmount: 100,
  },
  {
    tier: 'intermediate',
    dailyTransactionLimit: 5000,
    monthlyTransactionLimit: 50000,
    dailyWithdrawalLimit: 1000,
    maxWalletBalance: 25000,
    canTransferFunds: true,
    canWithdraw: true,
    canReceiveTransfers: true,
    maxP2PTransferAmount: 1000,
  },
  {
    tier: 'advanced',
    dailyTransactionLimit: 50000,
    monthlyTransactionLimit: 500000,
    dailyWithdrawalLimit: 10000,
    maxWalletBalance: 250000,
    canTransferFunds: true,
    canWithdraw: true,
    canReceiveTransfers: true,
    maxP2PTransferAmount: 10000,
  },
  {
    tier: 'unlimited',
    dailyTransactionLimit: 999999999,
    monthlyTransactionLimit: 999999999,
    dailyWithdrawalLimit: 999999999,
    maxWalletBalance: 999999999,
    canTransferFunds: true,
    canWithdraw: true,
    canReceiveTransfers: true,
    maxP2PTransferAmount: 999999999,
  },
];

// ============================================================================
// Verification Events
// ============================================================================

export const MOCK_VERIFICATION_EVENTS: VerificationEvent[] = [
  {
    id: 'event_001',
    userId: 'user_003',
    type: 'verification_started',
    status: 'pending',
    method: 'government_id',
    details: 'User initiated KYC verification process',
    timestamp: new Date('2024-01-04T10:00:00'),
  },
  {
    id: 'event_002',
    userId: 'user_003',
    type: 'document_uploaded',
    status: 'pending',
    method: 'government_id',
    details: 'Passport document uploaded for verification',
    timestamp: new Date('2024-01-04T10:15:00'),
  },
  {
    id: 'event_003',
    userId: 'user_003',
    type: 'verification_completed',
    status: 'verified',
    method: 'government_id',
    details: 'KYC verification completed successfully',
    timestamp: new Date('2024-01-05T14:30:00'),
    reviewedBy: 'admin_001',
  },
  {
    id: 'event_004',
    userId: 'user_003',
    type: 'tier_upgraded',
    status: 'verified',
    details: 'User tier upgraded from basic to advanced',
    timestamp: new Date('2024-01-05T14:31:00'),
    reviewedBy: 'admin_001',
  },
  {
    id: 'event_005',
    userId: 'user_004',
    type: 'verification_failed',
    status: 'rejected',
    details: 'Verification rejected: document expired',
    timestamp: new Date('2024-01-17T09:45:00'),
    rejectionReason: 'Document expired',
    reviewedBy: 'admin_002',
  },
];

// ============================================================================
// Selfie Verification
// ============================================================================

export const MOCK_SELFIE_VERIFICATION: SelfieVerification = {
  id: 'selfie_001',
  userId: 'user_003',
  imageUrl: '/uploads/kyc/selfie_001.jpg',
  fileName: 'selfie_20240104.jpg',
  uploadedAt: new Date('2024-01-04T10:30:00'),
  status: 'verified',
  faceLivenessScore: 94,
  faceMatchScore: 98,
  reviewedBy: 'admin_001',
  reviewedAt: new Date('2024-01-04T11:00:00'),
};

// ============================================================================
// Address Verification
// ============================================================================

export const MOCK_ADDRESS_VERIFICATION: AddressVerification = {
  id: 'addr_001',
  userId: 'user_003',
  documentType: 'utility_bill',
  status: 'approved',
  uploadedAt: new Date('2024-01-04T10:45:00'),
  verifiedAt: new Date('2024-01-04T11:15:00'),
  extractedAddress: {
    street: '789 Elm St',
    city: 'Austin',
    state: 'TX',
    postalCode: '78701',
    country: 'US',
  },
  matchesProfile: true,
  reviewedBy: 'admin_001',
};

// ============================================================================
// KYC Summary
// ============================================================================

export const MOCK_KYC_SUMMARY_VERIFIED: KYCSummary = {
  profile: MOCK_KYC_PROFILE_VERIFIED,
  documents: [MOCK_KYC_DOCUMENTS[0], MOCK_KYC_DOCUMENTS[3]],
  limits: MOCK_KYC_LIMITS[2], // Advanced tier
  isDocumentExpiringSoon: false,
  verificationProgress: 100,
  completedSteps: ['government_id', 'address_proof'],
  remainingSteps: [],
};

export const MOCK_KYC_SUMMARY_PENDING: KYCSummary = {
  profile: MOCK_KYC_PROFILE_PENDING,
  documents: [MOCK_KYC_DOCUMENTS[1], MOCK_KYC_DOCUMENTS[2]],
  limits: MOCK_KYC_LIMITS[0], // Basic tier
  isDocumentExpiringSoon: false,
  verificationProgress: 50,
  completedSteps: ['government_id'],
  remainingSteps: ['address_proof', 'selfie'],
};

export const MOCK_KYC_SUMMARY_UNVERIFIED: KYCSummary = {
  profile: MOCK_KYC_PROFILE_UNVERIFIED,
  documents: [],
  limits: MOCK_KYC_LIMITS[0], // Basic tier
  isDocumentExpiringSoon: false,
  verificationProgress: 0,
  completedSteps: [],
  remainingSteps: ['government_id', 'address_proof', 'selfie'],
};

// ============================================================================
// Paginated Responses
// ============================================================================

export function generatePaginatedDocuments(offset: number = 0, limit: number = 10): PaginatedResponse<KYCDocument> {
  const documents = [...MOCK_KYC_DOCUMENTS].sort((a, b) => 
    b.uploadedAt.getTime() - a.uploadedAt.getTime()
  );
  
  return {
    data: documents.slice(offset, offset + limit),
    total: documents.length,
    offset,
    limit,
  };
}

export function generatePaginatedEvents(offset: number = 0, limit: number = 10): PaginatedResponse<VerificationEvent> {
  const events = [...MOCK_VERIFICATION_EVENTS].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  return {
    data: events.slice(offset, offset + limit),
    total: events.length,
    offset,
    limit,
  };
}

// ============================================================================
// Timeline generation helper
// ============================================================================

export function generateVerificationTimeline(): VerificationEvent[] {
  const events: VerificationEvent[] = [];
  const now = new Date();
  
  // Started
  events.push({
    id: `event_${events.length}`,
    userId: 'user_002',
    type: 'verification_started',
    status: 'pending',
    method: 'government_id',
    details: 'Verification process initiated',
    timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  });
  
  // Document uploaded
  events.push({
    id: `event_${events.length}`,
    userId: 'user_002',
    type: 'document_uploaded',
    status: 'pending',
    details: 'ID document uploaded',
    timestamp: new Date(now.getTime() - 6.9 * 24 * 60 * 60 * 1000),
  });
  
  // Under review
  events.push({
    id: `event_${events.length}`,
    userId: 'user_002',
    type: 'document_uploaded',
    status: 'pending',
    details: 'Address proof uploaded',
    timestamp: new Date(now.getTime() - 6.8 * 24 * 60 * 60 * 1000),
  });
  
  return events;
}

// ============================================================================
// Verification progress helper
// ============================================================================

export const VERIFICATION_STEPS = [
  { id: 'government_id', label: 'Government ID', order: 1, estimatedMinutes: 5 },
  { id: 'address_proof', label: 'Address Proof', order: 2, estimatedMinutes: 3 },
  { id: 'selfie', label: 'Selfie Verification', order: 3, estimatedMinutes: 2 },
] as const;

export function calculateVerificationProgress(completedSteps: string[]): number {
  return Math.round((completedSteps.length / VERIFICATION_STEPS.length) * 100);
}

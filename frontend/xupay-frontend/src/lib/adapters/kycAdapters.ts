/**
 * KYC Adapters
 * Converts KYC data for display and provides utility functions
 */

import {
  KYCProfile,
  KYCDocument,
  KYCLimits,
  VerificationStatus,
  DocumentStatus,
  KYCLimitTier,
} from '@/types/kyc';

/**
 * Format verification status for display
 */
export function formatVerificationStatus(status: VerificationStatus): string {
  const statusMap: Record<VerificationStatus, string> = {
    unverified: 'Not Verified',
    pending: 'Pending Review',
    verified: 'Verified',
    rejected: 'Rejected',
    expired: 'Expired',
  };
  return statusMap[status];
}

/**
 * Format document status for display
 */
export function formatDocumentStatus(status: DocumentStatus): string {
  const statusMap: Record<DocumentStatus, string> = {
    uploaded: 'Uploaded',
    reviewing: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
    expired: 'Expired',
  };
  return statusMap[status];
}

/**
 * Format document type for display
 */
export function formatDocumentType(type: string): string {
  const typeMap: Record<string, string> = {
    passport: 'Passport',
    national_id: 'National ID',
    driver_license: "Driver's License",
    utility_bill: 'Utility Bill',
    bank_statement: 'Bank Statement',
  };
  return typeMap[type] || type;
}

/**
 * Get verification status badge class
 */
export function getVerificationStatusBadgeClass(status: VerificationStatus): string {
  const statusClasses: Record<VerificationStatus, string> = {
    unverified: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    verified: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    expired: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  };
  return statusClasses[status];
}

/**
 * Get document status badge class
 */
export function getDocumentStatusBadgeClass(status: DocumentStatus): string {
  const statusClasses: Record<DocumentStatus, string> = {
    uploaded: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    reviewing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    expired: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  };
  return statusClasses[status];
}

/**
 * Get verification status icon
 */
export function getVerificationStatusIcon(status: VerificationStatus): string {
  const iconMap: Record<VerificationStatus, string> = {
    unverified: '⭘',
    pending: '⏳',
    verified: '✓',
    rejected: '✕',
    expired: '⚠',
  };
  return iconMap[status];
}

/**
 * Get document status icon
 */
export function getDocumentStatusIcon(status: DocumentStatus): string {
  const iconMap: Record<DocumentStatus, string> = {
    uploaded: '📤',
    reviewing: '👁',
    approved: '✓',
    rejected: '✕',
    expired: '⚠',
  };
  return iconMap[status];
}

/**
 * Format limits currency display
 */
export function formatLimitAmount(amount: number): string {
  if (amount === 999999999) {
    return 'Unlimited';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get verification tier badge class
 */
export function getVerificationTierBadgeClass(tier: KYCLimitTier): string {
  const tierClasses: Record<KYCLimitTier, string> = {
    basic: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    unlimited: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  };
  return tierClasses[tier];
}

/**
 * Get tier label
 */
export function formatVerificationTier(tier: KYCLimitTier): string {
  const tierMap: Record<KYCLimitTier, string> = {
    basic: 'Basic Tier',
    intermediate: 'Intermediate Tier',
    advanced: 'Advanced Tier',
    unlimited: 'Unlimited Tier',
  };
  return tierMap[tier];
}

/**
 * Get verification progress color
 */
export function getProgressColor(progress: number): string {
  if (progress === 0) return 'bg-gray-300';
  if (progress < 33) return 'bg-red-500';
  if (progress < 66) return 'bg-yellow-500';
  if (progress < 100) return 'bg-blue-500';
  return 'bg-green-500';
}

/**
 * Check if document is expiring soon (within 30 days)
 */
export function isDocumentExpiringSoon(expiresAt?: Date): boolean {
  if (!expiresAt) return false;
  const daysUntilExpiry = Math.floor((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
}

/**
 * Check if document is expired
 */
export function isDocumentExpired(expiresAt?: Date): boolean {
  if (!expiresAt) return false;
  return expiresAt < new Date();
}

/**
 * Get days until expiry
 */
export function getDaysUntilExpiry(expiresAt?: Date): number | null {
  if (!expiresAt) return null;
  const now = new Date();
  const daysUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysUntilExpiry);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format timestamp for display
 */
export function formatVerificationTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format date for display
 */
export function formatKYCDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format time for display
 */
export function formatKYCTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get next verification tier
 */
export function getNextVerificationTier(currentTier: KYCLimitTier): KYCLimitTier | null {
  const tierProgression: Record<KYCLimitTier, KYCLimitTier | null> = {
    basic: 'intermediate',
    intermediate: 'advanced',
    advanced: 'unlimited',
    unlimited: null,
  };
  return tierProgression[currentTier];
}

/**
 * Get required documents for tier
 */
export function getRequiredDocumentsForTier(tier: KYCLimitTier): string[] {
  const requiredDocs: Record<KYCLimitTier, string[]> = {
    basic: ['government_id'],
    intermediate: ['government_id', 'address_proof'],
    advanced: ['government_id', 'address_proof', 'selfie'],
    unlimited: ['government_id', 'address_proof', 'selfie'],
  };
  return requiredDocs[tier];
}

/**
 * Validate KYC profile completeness
 */
export function validateProfileCompleteness(profile: KYCProfile): {
  isComplete: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  if (!profile.firstName) missingFields.push('First Name');
  if (!profile.lastName) missingFields.push('Last Name');
  if (!profile.dateOfBirth) missingFields.push('Date of Birth');
  if (!profile.nationality) missingFields.push('Nationality');
  if (!profile.street) missingFields.push('Street Address');
  if (!profile.city) missingFields.push('City');
  if (!profile.state) missingFields.push('State/Province');
  if (!profile.postalCode) missingFields.push('Postal Code');
  if (!profile.country) missingFields.push('Country');

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Map KYC Profile DTO to domain model
 */
export function mapKYCProfileDTO(dto: any): KYCProfile {
  return {
    userId: dto.userId,
    status: dto.status,
    verificationTier: dto.verificationTier,
    firstName: dto.firstName,
    lastName: dto.lastName,
    dateOfBirth: new Date(dto.dateOfBirth),
    nationality: dto.nationality,
    street: dto.street,
    city: dto.city,
    state: dto.state,
    postalCode: dto.postalCode,
    country: dto.country,
    verificationMethod: dto.verificationMethod,
    verifiedAt: dto.verifiedAt ? new Date(dto.verifiedAt) : undefined,
    expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    rejectionReason: dto.rejectionReason,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    lastVerifiedAt: dto.lastVerifiedAt ? new Date(dto.lastVerifiedAt) : undefined,
  };
}

/**
 * Map KYC Document DTO to domain model
 */
export function mapKYCDocumentDTO(dto: any): KYCDocument {
  return {
    id: dto.id,
    userId: dto.userId,
    type: dto.type,
    status: dto.status,
    fileName: dto.fileName,
    fileSize: dto.fileSize,
    fileUrl: dto.fileUrl,
    mimeType: dto.mimeType,
    uploadedAt: new Date(dto.uploadedAt),
    reviewedAt: dto.reviewedAt ? new Date(dto.reviewedAt) : undefined,
    reviewedBy: dto.reviewedBy,
    rejectionReason: dto.rejectionReason,
    expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    extractedData: dto.extractedData ? {
      documentNumber: dto.extractedData.documentNumber,
      issueDate: dto.extractedData.issueDate ? new Date(dto.extractedData.issueDate) : undefined,
      expiryDate: dto.extractedData.expiryDate ? new Date(dto.extractedData.expiryDate) : undefined,
      holder: dto.extractedData.holder,
    } : undefined,
  };
}

/**
 * Map KYC Limits DTO to domain model
 */
export function mapKYCLimitsDTO(dto: any): KYCLimits {
  return {
    tier: dto.tier,
    dailyTransactionLimit: dto.dailyTransactionLimit,
    monthlyTransactionLimit: dto.monthlyTransactionLimit,
    dailyWithdrawalLimit: dto.dailyWithdrawalLimit,
    maxWalletBalance: dto.maxWalletBalance,
    canTransferFunds: dto.canTransferFunds,
    canWithdraw: dto.canWithdraw,
    canReceiveTransfers: dto.canReceiveTransfers,
    maxP2PTransferAmount: dto.maxP2PTransferAmount,
  };
}

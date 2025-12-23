/**
 * KYC Verification Dashboard Page
 * Main entry point for user KYC verification
 */

'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { VerificationProgressCard } from '@/components/kyc/VerificationProgressCard';
import { VerificationMethodSelector } from '@/components/kyc/VerificationMethodSelector';
import { DocumentUploadCard } from '@/components/kyc/DocumentUploadCard';
import { DocumentList } from '@/components/kyc/DocumentList';
import { KYCLimitsCard } from '@/components/kyc/KYCLimitsCard';
import { VerificationTimeline } from '@/components/kyc/VerificationTimeline';
import { useKYCProfile, useKYCSummary, useKYCDocuments, useKYCLimits, useVerificationEvents, useDocumentUpload } from '@/hooks/api/useKYC';
import type { VerificationMethod } from '@/types/kyc';

// Note: Metadata export removed - using 'use client' directive
// Metadata will be handled by parent layout

export default function KYCVerificationPage() {
  const { profile, loading: profileLoading, error: profileError } = useKYCProfile();
  const { summary, loading: summaryLoading, error: summaryError } = useKYCSummary();
  const { documents, loading: docsLoading, error: docsError, refetch: refetchDocs } = useKYCDocuments();
  const { limits, loading: limitsLoading, error: limitsError } = useKYCLimits();
  const { events, loading: eventsLoading, error: eventsError } = useVerificationEvents();
  const { upload: uploadDocument, uploading: uploadLoading, error: uploadError } = useDocumentUpload();

  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<string>('passport');

  const isLoading = profileLoading || summaryLoading || docsLoading || limitsLoading || eventsLoading;

  const handleDocumentUpload = async (file: File, type: string) => {
    try {
      await uploadDocument(file, type as any);
      // Refetch documents after successful upload
      refetchDocs();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleMethodSelect = (method: VerificationMethod) => {
    setSelectedMethod(method);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Identity Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Complete your KYC verification to unlock advanced features and higher transaction limits
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Verification Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Verification Progress Card */}
            {summary ? (
              <VerificationProgressCard
                status={summary.profile.status}
                tier={summary.profile.verificationTier}
                progress={summary.verificationProgress}
                completedSteps={summary.completedSteps}
                remainingSteps={summary.remainingSteps}
              />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center animate-pulse">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading progress...</span>
                </div>
              </div>
            )}

            {/* Verification Method Selector */}
            <VerificationMethodSelector
              selectedMethod={selectedMethod}
              onSelect={handleMethodSelect}
              disabled={isLoading || profile?.status === 'verified'}
              showDescription={true}
            />

            {/* Document Upload Card */}
            <DocumentUploadCard
              documentType={selectedDocType as any}
              onUpload={async (file: File) => handleDocumentUpload(file, selectedDocType)}
              isUploading={uploadLoading}
              error={uploadError?.message || undefined}
              maxFileSize={10}
              acceptedFormats={['.pdf', '.jpg', '.jpeg', '.png']}
            />

            {/* Document List */}
            <DocumentList
              documents={documents || []}
              isLoading={docsLoading}
              onDelete={async (docId) => console.log('Delete:', docId)}
              canDelete={profile?.status !== 'verified'}
            />
          </div>

          {/* Right Column - Information & Benefits */}
          <div className="space-y-6">
            {/* KYC Limits Card */}
            <KYCLimitsCard limits={limits} isLoading={limitsLoading} />

            {/* Info Card */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-3">
                Why Verify Your Identity?
              </h3>
              <ul className="space-y-2 text-xs text-blue-800 dark:text-blue-400">
                <li>✓ Unlock higher transaction limits</li>
                <li>✓ Access advanced features</li>
                <li>✓ Comply with regulations</li>
                <li>✓ Secure your account</li>
              </ul>
            </div>

            {/* Security Info */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <h3 className="font-semibold text-sm text-green-900 dark:text-green-300 mb-3">
                Your Data is Secure
              </h3>
              <p className="text-xs text-green-800 dark:text-green-400">
                We use military-grade encryption and follow all compliance standards to protect your personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-8">
          <VerificationTimeline events={events || []} isLoading={eventsLoading} />
        </div>
      </div>
    </main>
  );
}

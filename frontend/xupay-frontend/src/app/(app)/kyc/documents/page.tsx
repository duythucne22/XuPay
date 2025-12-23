/**
 * KYC Documents Management Page
 * View and manage uploaded KYC documents
 */

'use client';

import { useState } from 'react';
import { DocumentList } from '@/components/kyc/DocumentList';
import { useKYCDocuments, useKYCProfile } from '@/hooks/api/useKYC';
import type { DocumentStatus, DocumentType, KYCDocument } from '@/types/kyc';

// Note: Metadata removed for 'use client' component

export default function KYCDocumentsPage() {
  const { documents, loading: docsLoading, error: docsError, refetch: refetchDocs } = useKYCDocuments();
  const { profile } = useKYCProfile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter documents based on search and filters
  const filteredDocs = (documents || []).filter((doc: KYCDocument) => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || doc.status === statusFilter;
    const matchesType = !typeFilter || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const stats = {
    total: (documents || []).length || 0,
    approved: (documents || []).filter((d: KYCDocument) => d.status === 'approved').length,
    reviewing: (documents || []).filter((d: KYCDocument) => d.status === 'reviewing').length,
    rejected: (documents || []).filter((d: KYCDocument) => d.status === 'rejected').length,
  };

  const handleDeleteDocument = async (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      // TODO: Implement delete via hook
      console.log('Delete document:', docId);
      refetchDocs();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Document Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage all your uploaded identity verification documents
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by Status */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | '')}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="reviewing">Under Review</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>

          {/* Filter by Type */}
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocumentType | '')}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="passport">Passport</option>
            <option value="national_id">National ID</option>
            <option value="driver_license">Driver's License</option>
            <option value="utility_bill">Utility Bill</option>
            <option value="bank_statement">Bank Statement</option>
          </select>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document List - Main Content */}
          <div className="lg:col-span-2">
            {docsError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                <h3 className="font-semibold text-red-900 dark:text-red-300">Error Loading Documents</h3>
                <p className="text-sm text-red-800 dark:text-red-400 mt-2">{docsError.message}</p>
                <button 
                  onClick={() => refetchDocs()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : (
              <DocumentList
                documents={filteredDocs}
                isLoading={docsLoading}
                onDelete={handleDeleteDocument}
                canDelete={profile?.status !== 'verified'}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Document Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Uploaded</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">{stats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Approved</span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">{stats.approved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Under Review</span>
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{stats.reviewing}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
                  <span className="font-bold text-lg text-red-600 dark:text-red-400">{stats.rejected}</span>
                </div>
              </div>
            </div>

            {/* Upload Info */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Upload Guidelines
              </h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>✓ File formats: PDF, JPG, PNG</li>
                <li>✓ Max file size: 10 MB</li>
                <li>✓ Clear, unblurred images</li>
                <li>✓ All corners visible</li>
                <li>✓ Recent documents only</li>
              </ul>
            </div>

            {/* Document Requirements */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-3">
                Document Requirements
              </h3>
              <p className="text-xs text-blue-800 dark:text-blue-400">
                To proceed with verification, you need to upload at least one government-issued ID document.
              </p>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium">0</span> of <span className="font-medium">0</span> documents
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition">
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

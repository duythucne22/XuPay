/**
 * Document List Component
 * Displays uploaded documents with status and actions
 */

'use client';

import { motion } from 'framer-motion';
import { Trash2, Download, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { KYCDocument } from '@/types/kyc';
import {
  formatDocumentType,
  formatDocumentStatus,
  getDocumentStatusBadgeClass,
  getDocumentStatusIcon,
  formatFileSize,
  formatKYCDate,
  isDocumentExpired,
  isDocumentExpiringSoon,
  getDaysUntilExpiry,
} from '@/lib/adapters/kycAdapters';

interface DocumentListProps {
  documents: KYCDocument[];
  isLoading?: boolean;
  onDelete?: (documentId: string) => Promise<void>;
  canDelete?: boolean;
}

export function DocumentList({
  documents,
  isLoading,
  onDelete,
  canDelete = true,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            No documents uploaded yet
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Start by uploading your government ID
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Uploaded Documents
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
        </p>
      </div>

      {/* Document List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {documents.map((doc, idx) => {
          const isExpired = isDocumentExpired(doc.expiresAt);
          const expiringSoon = isDocumentExpiringSoon(doc.expiresAt) && !isExpired;
          const daysUntilExpiry = getDaysUntilExpiry(doc.expiresAt);

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
            >
              <div className="flex items-start justify-between">
                {/* Document Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDocumentType(doc.type)}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusBadgeClass(doc.status)}`}>
                      {getDocumentStatusIcon(doc.status)} {formatDocumentStatus(doc.status)}
                    </span>
                  </div>

                  {/* File Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>{doc.fileName}</span>
                    <span>•</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>•</span>
                    <span>Uploaded {formatKYCDate(doc.uploadedAt)}</span>
                  </div>

                  {/* Expiry Info */}
                  {doc.expiresAt && (
                    <div className={`text-xs font-medium mt-2 ${
                      isExpired
                        ? 'text-red-600 dark:text-red-400'
                        : expiringSoon
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {isExpired ? (
                        <>
                          <AlertCircle className="inline w-3 h-3 mr-1" />
                          Document expired
                        </>
                      ) : expiringSoon ? (
                        <>
                          <Clock className="inline w-3 h-3 mr-1" />
                          Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                        </>
                      ) : (
                        <>
                          Valid until {formatKYCDate(doc.expiresAt)}
                        </>
                      )}
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {doc.status === 'rejected' && doc.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-300">
                      Reason: {doc.rejectionReason}
                    </div>
                  )}

                  {/* Extracted Data */}
                  {doc.extractedData && doc.status === 'approved' && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="inline w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
                      Document verified and data extracted
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => window.open(doc.fileUrl, '_blank')}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition"
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {canDelete && onDelete && (
                    <button
                      onClick={() => onDelete(doc.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

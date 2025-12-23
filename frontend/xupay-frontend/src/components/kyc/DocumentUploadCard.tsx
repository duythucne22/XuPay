/**
 * Document Upload Card Component
 * File upload interface for KYC documents
 */

'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { DocumentType } from '@/types/kyc';
import { formatFileSize, formatDocumentType } from '@/lib/adapters/kycAdapters';

interface DocumentUploadCardProps {
  documentType: DocumentType;
  onUpload: (file: File, type: DocumentType) => Promise<void>;
  isUploading?: boolean;
  error?: string | null;
  maxFileSize?: number; // bytes
  acceptedFormats?: string[];
}

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ACCEPTED_FORMATS = ['.pdf', '.jpg', '.jpeg', '.png'];

export function DocumentUploadCard({
  documentType,
  onUpload,
  isUploading,
  error,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
}: DocumentUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(error || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    // Validate file size
    if (selectedFile.size > maxFileSize) {
      setUploadError(`File size exceeds ${formatFileSize(maxFileSize)}`);
      return;
    }

    // Validate format
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!DEFAULT_ACCEPTED_FORMATS.includes(ext)) {
      setUploadError(`File format not supported. Accepted: ${DEFAULT_ACCEPTED_FORMATS.join(', ')}`);
      return;
    }

    setFile(selectedFile);
    setUploadError(null);
    setUploadSuccess(false);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploadError(null);
      await onUpload(file, documentType);
      setUploadSuccess(true);
      setFile(null);
      setPreview(null);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setUploadSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(message);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatDocumentType(documentType)}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload a clear image or PDF of your {formatDocumentType(documentType).toLowerCase()}
        </p>
      </div>

      {uploadSuccess ? (
        // Success State
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>
          <p className="text-lg font-medium text-green-700 dark:text-green-300 mt-4">
            Document uploaded successfully
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Your document is now under review
          </p>
        </motion.div>
      ) : (
        <>
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !file && fileInputRef.current?.click()}
            className={`relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition ${
              file
                ? 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-400 dark:hover:bg-gray-700'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={DEFAULT_ACCEPTED_FORMATS.join(',')}
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {!file && !preview && (
              <div className="flex flex-col items-center">
                <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {DEFAULT_ACCEPTED_FORMATS.join(', ')} up to {formatFileSize(maxFileSize)}
                </p>
              </div>
            )}

            {/* File Preview */}
            {file && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                {preview ? (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={preview}
                    alt="Preview"
                    className="max-h-32 mb-4 rounded-lg object-cover"
                  />
                ) : (
                  <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                )}
                <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatFileSize(file.size)}
                </p>
              </motion.div>
            )}
          </div>

          {/* Error Message */}
          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          {file && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </button>
              <button
                onClick={handleClear}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Clear
              </button>
            </div>
          )}

          {/* File Requirements */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
              Requirements
            </p>
            <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <li>✓ Clear, unblurred document</li>
              <li>✓ All corners visible</li>
              <li>✓ Matches document type</li>
              <li>✓ Recent photo (within 6 months)</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

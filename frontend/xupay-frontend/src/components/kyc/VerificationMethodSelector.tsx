/**
 * Verification Method Selector Component
 * Allows users to choose their preferred verification method
 */

'use client';

import { motion } from 'framer-motion';
import { FileText, Camera, MapPin, Video, Users } from 'lucide-react';
import { VerificationMethod } from '@/types/kyc';

interface VerificationMethodSelectorProps {
  selectedMethod: VerificationMethod | null;
  onSelect: (method: VerificationMethod) => void;
  disabled?: boolean;
  showDescription?: boolean;
}

const VERIFICATION_METHODS: Array<{
  id: VerificationMethod;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  estimatedTime: string;
  badge?: string;
}> = [
  {
    id: 'government_id',
    label: 'Government ID',
    description: 'Verify with passport, driver license, or national ID',
    icon: FileText,
    estimatedTime: '5-10 min',
  },
  {
    id: 'selfie',
    label: 'Selfie Verification',
    description: 'Take a selfie for facial recognition and liveness check',
    icon: Camera,
    estimatedTime: '2-3 min',
  },
  {
    id: 'address_proof',
    label: 'Address Proof',
    description: 'Upload a utility bill or bank statement',
    icon: MapPin,
    estimatedTime: '3-5 min',
  },
  {
    id: 'video_call',
    label: 'Video Call',
    description: 'Real-time verification with a live representative',
    icon: Video,
    estimatedTime: '10-15 min',
    badge: 'Premium',
  },
  {
    id: 'third_party',
    label: 'Third Party Service',
    description: 'Verify through a trusted identity verification service',
    icon: Users,
    estimatedTime: '5-10 min',
  },
];

export function VerificationMethodSelector({
  selectedMethod,
  onSelect,
  disabled,
  showDescription = true,
}: VerificationMethodSelectorProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Choose Verification Method
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Select how you'd like to verify your identity
      </p>

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VERIFICATION_METHODS.map((method, idx) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => !disabled && onSelect(method.id as VerificationMethod)}
              disabled={disabled}
              className={`relative rounded-lg border-2 p-4 text-left transition ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selector-indicator"
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">✓</span>
                </motion.div>
              )}

              {/* Badge */}
              {method.badge && (
                <span className="inline-block mb-3 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  {method.badge}
                </span>
              )}

              {/* Icon and Title */}
              <div className="flex items-start gap-3 mb-3">
                <Icon className={`w-6 h-6 flex-shrink-0 ${
                  isSelected
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`} />
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm ${
                    isSelected
                      ? 'text-blue-900 dark:text-blue-300'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {method.label}
                  </h4>
                </div>
              </div>

              {/* Description */}
              {showDescription && (
                <p className={`text-xs mb-3 ${
                  isSelected
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {method.description}
                </p>
              )}

              {/* Estimated Time */}
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                isSelected
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                ⏱ {method.estimatedTime}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <p className="text-xs text-gray-600 dark:text-gray-400">
          💡 <span className="font-medium">Tip:</span> Government ID verification is the fastest way to get started. Other methods can be added later to unlock higher limits.
        </p>
      </motion.div>
    </div>
  );
}

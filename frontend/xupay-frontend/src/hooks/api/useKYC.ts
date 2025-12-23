'use client';

/**
 * KYC Hooks
 * React hooks for KYC data fetching with intelligent caching
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  KYCProfile,
  KYCDocument,
  KYCLimits,
  KYCSummary,
  VerificationEvent,
  SelfieVerification,
  AddressVerification,
  PaginatedResponse,
  KYCFilters,
  KYCEventFilters,
} from '@/types/kyc';
import { kycApi } from '@/lib/api/kycApi';

/**
 * Cache management utilities
 */
const cacheStore = new Map<string, { data: any; timestamp: number }>();

function getCachedData<T>(key: string, ttlMs: number): T | null {
  const cached = cacheStore.get(key);
  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > ttlMs;
  if (isExpired) {
    cacheStore.delete(key);
    return null;
  }

  return cached.data as T;
}

function setCachedData<T>(key: string, data: T): void {
  cacheStore.set(key, { data, timestamp: Date.now() });
}

function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cacheStore.clear();
    return;
  }
  
  for (const key of cacheStore.keys()) {
    if (key.includes(pattern)) {
      cacheStore.delete(key);
    }
  }
}

// ============================================================================
// Hook: useKYCProfile
// ============================================================================

interface UseKYCProfileResult {
  profile: KYCProfile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch user KYC profile with 10-minute cache
 */
export function useKYCProfile(userId?: string): UseKYCProfileResult {
  const [profile, setProfile] = useState<KYCProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheKeyRef = useRef(`kyc_profile_${userId || 'current'}`);

  const fetch = useCallback(async () => {
    const cacheKey = cacheKeyRef.current;
    
    try {
      // Check cache (10-minute TTL)
      const cached = getCachedData<KYCProfile>(cacheKey, 10 * 60 * 1000);
      if (cached) {
        setProfile(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await kycApi.getProfile(userId);
      setCachedData(cacheKey, result);
      setProfile(result);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch profile');
      setError(error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { profile, loading, error, refetch: fetch };
}

// ============================================================================
// Hook: useKYCSummary
// ============================================================================

interface UseKYCSummaryResult {
  summary: KYCSummary | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch complete KYC summary with 10-minute cache
 */
export function useKYCSummary(userId?: string): UseKYCSummaryResult {
  const [summary, setSummary] = useState<KYCSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheKeyRef = useRef(`kyc_summary_${userId || 'current'}`);

  const fetch = useCallback(async () => {
    const cacheKey = cacheKeyRef.current;
    
    try {
      // Check cache (10-minute TTL)
      const cached = getCachedData<KYCSummary>(cacheKey, 10 * 60 * 1000);
      if (cached) {
        setSummary(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await kycApi.getSummary(userId);
      setCachedData(cacheKey, result);
      setSummary(result);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch summary');
      setError(error);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { summary, loading, error, refetch: fetch };
}

// ============================================================================
// Hook: useKYCDocuments
// ============================================================================

interface UseKYCDocumentsResult {
  documents: KYCDocument[];
  total: number;
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  refetch: () => Promise<void>;
}

/**
 * Fetch KYC documents with optional filters
 * No caching on paginated requests
 */
export function useKYCDocuments(filters?: KYCFilters): UseKYCDocumentsResult {
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await kycApi.getDocuments(filters);
      setDocuments(result.data);
      setTotal(result.total);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch documents');
      setError(error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [filters?.offset, filters?.limit, filters?.status, filters?.documentType]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const offset = filters?.offset ?? 0;
  const limit = filters?.limit ?? 10;
  const hasMore = offset + limit < total;

  return { documents, total, loading, error, hasMore, refetch: fetch };
}

// ============================================================================
// Hook: useKYCLimits
// ============================================================================

interface UseKYCLimitsResult {
  limits: KYCLimits | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch current KYC limits with 30-minute cache
 */
export function useKYCLimits(): UseKYCLimitsResult {
  const [limits, setLimits] = useState<KYCLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheKey = 'kyc_limits_current';

  const fetch = useCallback(async () => {
    try {
      // Check cache (30-minute TTL)
      const cached = getCachedData<KYCLimits>(cacheKey, 30 * 60 * 1000);
      if (cached) {
        setLimits(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await kycApi.getLimits();
      setCachedData(cacheKey, result);
      setLimits(result);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch limits');
      setError(error);
      setLimits(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { limits, loading, error, refetch: fetch };
}

// ============================================================================
// Hook: useKYCAllLimits
// ============================================================================

interface UseKYCAllLimitsResult {
  limits: KYCLimits[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch all KYC limits with 30-minute cache
 */
export function useKYCAllLimits(): UseKYCAllLimitsResult {
  const [limits, setLimits] = useState<KYCLimits[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheKey = 'kyc_limits_all';

  const fetch = useCallback(async () => {
    try {
      // Check cache (30-minute TTL)
      const cached = getCachedData<KYCLimits[]>(cacheKey, 30 * 60 * 1000);
      if (cached) {
        setLimits(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await kycApi.getAllLimits();
      setCachedData(cacheKey, result);
      setLimits(result);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch limits');
      setError(error);
      setLimits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { limits, loading, error, refetch: fetch };
}

// ============================================================================
// Hook: useVerificationEvents
// ============================================================================

interface UseVerificationEventsResult {
  events: VerificationEvent[];
  total: number;
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  refetch: () => Promise<void>;
}

/**
 * Fetch verification events with optional filters
 * No caching on paginated requests
 */
export function useVerificationEvents(filters?: KYCEventFilters): UseVerificationEventsResult {
  const [events, setEvents] = useState<VerificationEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await kycApi.getVerificationEvents(filters);
      setEvents(result.data);
      setTotal(result.total);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch events');
      setError(error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [filters?.offset, filters?.limit, filters?.eventType]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const offset = filters?.offset ?? 0;
  const limit = filters?.limit ?? 10;
  const hasMore = offset + limit < total;

  return { events, total, loading, error, hasMore, refetch: fetch };
}

// ============================================================================
// Hook: useDocumentUpload
// ============================================================================

interface UseDocumentUploadResult {
  upload: (file: File, documentType: string) => Promise<KYCDocument>;
  uploading: boolean;
  error: Error | null;
}

/**
 * Upload KYC document
 */
export function useDocumentUpload(): UseDocumentUploadResult {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(async (file: File, documentType: string): Promise<KYCDocument> => {
    try {
      setUploading(true);
      setError(null);
      const result = await kycApi.uploadDocument(file, documentType);
      
      // Invalidate document cache
      invalidateCache('kyc_documents');
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload document');
      setError(error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error };
}

// ============================================================================
// Hook: useSelfieUpload
// ============================================================================

interface UseSelfieUploadResult {
  upload: (file: File) => Promise<SelfieVerification>;
  uploading: boolean;
  error: Error | null;
}

/**
 * Upload selfie for liveness verification
 */
export function useSelfieUpload(): UseSelfieUploadResult {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(async (file: File): Promise<SelfieVerification> => {
    try {
      setUploading(true);
      setError(null);
      const result = await kycApi.uploadSelfie(file);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload selfie');
      setError(error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error };
}

// ============================================================================
// Hook: useVerificationSubmit
// ============================================================================

interface UseVerificationSubmitResult {
  submit: (documentIds: string[]) => Promise<KYCProfile>;
  submitting: boolean;
  error: Error | null;
}

/**
 * Submit verification
 */
export function useVerificationSubmit(): UseVerificationSubmitResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(async (documentIds: string[]): Promise<KYCProfile> => {
    try {
      setSubmitting(true);
      setError(null);
      const result = await kycApi.submitVerification(documentIds);
      
      // Invalidate caches
      invalidateCache('kyc_profile');
      invalidateCache('kyc_summary');
      
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to submit verification');
      setError(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting, error };
}

// ============================================================================
// Hook: useVerificationRenewal
// ============================================================================

interface UseVerificationRenewalResult {
  renew: () => Promise<KYCProfile>;
  renewing: boolean;
  error: Error | null;
}

/**
 * Renew expired verification
 */
export function useVerificationRenewal(): UseVerificationRenewalResult {
  const [renewing, setRenewing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const renew = useCallback(async (): Promise<KYCProfile> => {
    try {
      setRenewing(true);
      setError(null);
      const result = await kycApi.renewVerification();
      
      // Invalidate caches
      invalidateCache('kyc_profile');
      invalidateCache('kyc_summary');
      
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to renew verification');
      setError(error);
      throw error;
    } finally {
      setRenewing(false);
    }
  }, []);

  return { renew, renewing, error };
}

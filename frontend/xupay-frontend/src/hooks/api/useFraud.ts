/**
 * Fraud Detection Hooks
 * Custom React hooks for fraud data fetching and state management
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { fraudApi } from '@/lib/api/fraudApi';
import {
  FraudMetrics,
  FlaggedTransaction,
  FraudTrend,
  FraudHeatmapData,
  FraudRule,
  FraudFilters,
  PaginatedResponse,
} from '@/types/fraud';

/**
 * Cache configuration
 */
const CACHE_TTL = {
  metrics: 5 * 60 * 1000, // 5 minutes
  trends: 10 * 60 * 1000, // 10 minutes
  rules: 30 * 60 * 1000, // 30 minutes
  heatmap: 10 * 60 * 1000, // 10 minutes
  transactions: 0, // No cache (always fresh)
};

/**
 * Cache store
 */
const cache: Record<string, { data: any; timestamp: number }> = {};

/**
 * Get cached data if valid
 */
function getCachedData(key: string, ttl: number) {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  return null;
}

/**
 * Set cached data
 */
function setCachedData(key: string, data: any) {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Hook: Fraud Metrics
 * Fetches KPI metrics for fraud dashboard
 */
export function useFraudMetrics() {
  const [data, setData] = useState<FraudMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    const cacheKey = 'fraud_metrics';
    const cached = getCachedData(cacheKey, CACHE_TTL.metrics);

    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fraudApi.getMetrics();
      setCachedData(cacheKey, result);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('useFraudMetrics error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = useCallback(() => {
    // Clear cache
    delete cache['fraud_metrics'];
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch };
}

/**
 * Hook: Flagged Transactions
 * Fetches paginated list of flagged transactions
 */
export function useFlaggedTransactions(filters: FraudFilters = {}) {
  const [data, setData] = useState<FlaggedTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fraudApi.getTransactions(filters);
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('useFlaggedTransactions error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const hasMore = (filters.offset || 0) + (filters.limit || 50) < total;

  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    total,
    loading,
    error,
    hasMore,
    refetch,
  };
}

/**
 * Hook: Fraud Trends
 * Fetches time-series fraud trend data
 */
export function useFraudTrends(dateRange: string = '30d') {
  const [data, setData] = useState<FraudTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    const cacheKey = `fraud_trends_${dateRange}`;
    const cached = getCachedData(cacheKey, CACHE_TTL.trends);

    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fraudApi.getTrends(dateRange);
      setCachedData(cacheKey, result);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('useFraudTrends error:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = useCallback(() => {
    delete cache[`fraud_trends_${dateRange}`];
    fetch();
  }, [dateRange, fetch]);

  return { data, loading, error, refetch };
}

/**
 * Hook: Fraud Rules
 * Fetches list of fraud detection rules
 */
export function useFraudRules() {
  const [data, setData] = useState<FraudRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    const cacheKey = 'fraud_rules';
    const cached = getCachedData(cacheKey, CACHE_TTL.rules);

    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fraudApi.getRules();
      setCachedData(cacheKey, result);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('useFraudRules error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = useCallback(() => {
    delete cache['fraud_rules'];
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch };
}

/**
 * Hook: Fraud Heatmap
 * Fetches heatmap data for fraud distribution
 */
export function useFraudHeatmap(
  dimension: 'transactionType' | 'walletType' | 'userSegment' = 'transactionType'
) {
  const [data, setData] = useState<FraudHeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    const cacheKey = `fraud_heatmap_${dimension}`;
    const cached = getCachedData(cacheKey, CACHE_TTL.heatmap);

    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fraudApi.getHeatmap(dimension);
      setCachedData(cacheKey, result);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('useFraudHeatmap error:', err);
    } finally {
      setLoading(false);
    }
  }, [dimension]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = useCallback(() => {
    delete cache[`fraud_heatmap_${dimension}`];
    fetch();
  }, [dimension, fetch]);

  return { data, loading, error, refetch };
}

/**
 * Hook: Fraud Transaction Action
 * Takes action on flagged transactions
 */
export function useFraudTransactionAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (transactionId: string, action: 'approve' | 'block' | 'review', reason: string) => {
    try {
      setLoading(true);
      setError(null);
      await fraudApi.actionOnTransaction(transactionId, action, reason);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('useFraudTransactionAction error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}

/**
 * Fraud API Client
 * Handles all fraud-related API calls
 */

import {
  FraudMetrics,
  FlaggedTransaction,
  FraudTrend,
  FraudHeatmapData,
  FraudRule,
  PaginatedResponse,
  ApiResponse,
  FraudFilters,
  FraudAction,
} from '@/types/fraud';

import {
  MOCK_FRAUD_METRICS,
  MOCK_FLAGGED_TRANSACTIONS,
  MOCK_FRAUD_TRENDS,
  MOCK_FRAUD_HEATMAP_BY_TYPE,
  MOCK_FRAUD_HEATMAP_BY_WALLET,
  MOCK_FRAUD_RULES,
  generatePaginatedTransactions,
} from '@/mocks/fraud';

/**
 * Fraud API Client
 * All methods return mock data for now, ready for backend integration
 */
export const fraudApi = {
  /**
   * Get fraud metrics summary
   * GET /api/fraud/metrics
   */
  async getMetrics(): Promise<FraudMetrics> {
    try {
      // TODO: Replace with real API call when backend is ready
      // const response = await fetch('/api/fraud/metrics');
      // return await response.json();

      // For now, simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      return MOCK_FRAUD_METRICS;
    } catch (error) {
      console.error('Error fetching fraud metrics:', error);
      throw new Error('Failed to fetch fraud metrics');
    }
  },

  /**
   * Get paginated list of flagged transactions
   * GET /api/fraud/transactions?offset=0&limit=50&status=flagged
   */
  async getTransactions(
    filters: FraudFilters = {}
  ): Promise<PaginatedResponse<FlaggedTransaction>> {
    try {
      // TODO: Replace with real API call when backend is ready
      // const queryParams = new URLSearchParams();
      // if (filters.offset) queryParams.append('offset', filters.offset.toString());
      // if (filters.limit) queryParams.append('limit', filters.limit.toString());
      // if (filters.status) queryParams.append('status', filters.status);
      // const response = await fetch(`/api/fraud/transactions?${queryParams}`);
      // return await response.json();

      await new Promise((resolve) => setTimeout(resolve, 300));

      const offset = filters.offset || 0;
      const limit = filters.limit || 50;

      // Apply client-side filtering for mock data
      let filtered = [...MOCK_FLAGGED_TRANSACTIONS];

      if (filters.status) {
        filtered = filtered.filter((t) => t.status === filters.status);
      }

      if (filters.riskLevel) {
        filtered = filtered.filter((t) => t.riskLevel === filters.riskLevel);
      }

      if (filters.minAmount) {
        filtered = filtered.filter((t) => t.amount >= filters.minAmount!);
      }

      if (filters.maxAmount) {
        filtered = filtered.filter((t) => t.amount <= filters.maxAmount!);
      }

      if (filters.type) {
        filtered = filtered.filter((t) => t.type === filters.type);
      }

      return {
        data: filtered.slice(offset, offset + limit),
        total: filtered.length,
        offset,
        limit,
      };
    } catch (error) {
      console.error('Error fetching flagged transactions:', error);
      throw new Error('Failed to fetch flagged transactions');
    }
  },

  /**
   * Get fraud trends over time
   * GET /api/fraud/trends?dateRange=7d&granularity=day
   */
  async getTrends(dateRange: string = '30d'): Promise<FraudTrend[]> {
    try {
      // TODO: Replace with real API call when backend is ready
      // const response = await fetch(`/api/fraud/trends?dateRange=${dateRange}`);
      // return await response.json();

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Return last N days based on dateRange
      const days = parseInt(dateRange) || 30;
      return MOCK_FRAUD_TRENDS.slice(-days);
    } catch (error) {
      console.error('Error fetching fraud trends:', error);
      throw new Error('Failed to fetch fraud trends');
    }
  },

  /**
   * Get fraud heatmap data
   * GET /api/fraud/heatmap?dimension=transactionType
   */
  async getHeatmap(
    dimension: 'transactionType' | 'walletType' | 'userSegment' = 'transactionType'
  ): Promise<FraudHeatmapData[]> {
    try {
      // TODO: Replace with real API call when backend is ready
      // const response = await fetch(`/api/fraud/heatmap?dimension=${dimension}`);
      // return await response.json();

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Return different heatmap data based on dimension
      if (dimension === 'transactionType') {
        return MOCK_FRAUD_HEATMAP_BY_TYPE;
      } else if (dimension === 'walletType') {
        return MOCK_FRAUD_HEATMAP_BY_WALLET;
      }

      return MOCK_FRAUD_HEATMAP_BY_TYPE;
    } catch (error) {
      console.error('Error fetching fraud heatmap:', error);
      throw new Error('Failed to fetch fraud heatmap');
    }
  },

  /**
   * Get list of fraud detection rules
   * GET /api/fraud/rules
   */
  async getRules(): Promise<FraudRule[]> {
    try {
      // TODO: Replace with real API call when backend is ready
      // const response = await fetch('/api/fraud/rules');
      // return await response.json();

      await new Promise((resolve) => setTimeout(resolve, 300));

      return MOCK_FRAUD_RULES;
    } catch (error) {
      console.error('Error fetching fraud rules:', error);
      throw new Error('Failed to fetch fraud rules');
    }
  },

  /**
   * Take action on a flagged transaction
   * POST /api/fraud/transactions/{id}/action
   */
  async actionOnTransaction(
    transactionId: string,
    action: FraudAction,
    reason: string
  ): Promise<ApiResponse<void>> {
    try {
      // TODO: Replace with real API call when backend is ready
      // const response = await fetch(`/api/fraud/transactions/${transactionId}/action`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ action, reason }),
      // });
      // return await response.json();

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Mock success response
      return {
        data: undefined as any,
        success: true,
        message: `Transaction ${action} successfully`,
      };
    } catch (error) {
      console.error('Error taking action on transaction:', error);
      throw new Error('Failed to take action on transaction');
    }
  },

  /**
   * Enable/disable fraud rule
   * PATCH /api/fraud/rules/{id}
   */
  async updateRule(
    ruleId: string,
    updates: Partial<FraudRule>
  ): Promise<FraudRule> {
    try {
      // TODO: Replace with real API call when backend is ready
      // const response = await fetch(`/api/fraud/rules/${ruleId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates),
      // });
      // return await response.json();

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find and update mock rule
      const rule = MOCK_FRAUD_RULES.find((r) => r.id === ruleId);
      if (!rule) {
        throw new Error('Rule not found');
      }

      return { ...rule, ...updates, updatedAt: new Date() };
    } catch (error) {
      console.error('Error updating fraud rule:', error);
      throw new Error('Failed to update fraud rule');
    }
  },

  /**
   * Create custom fraud rule
   * POST /api/fraud/rules
   */
  async createRule(rule: Omit<FraudRule, 'id' | 'createdAt'>): Promise<FraudRule> {
    try {
      // TODO: Replace with real API call when backend is ready
      // const response = await fetch('/api/fraud/rules', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(rule),
      // });
      // return await response.json();

      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        ...rule,
        id: `rule_${Date.now()}`,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error creating fraud rule:', error);
      throw new Error('Failed to create fraud rule');
    }
  },
};

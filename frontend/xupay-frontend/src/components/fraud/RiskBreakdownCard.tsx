'use client';

import { RiskBreakdown } from '@/types/fraud';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function RiskBreakdownCard({ riskBreakdown }: { riskBreakdown: RiskBreakdown }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Risk Analysis
        </h3>
      </div>

      {/* ML Prediction */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Machine Learning Prediction
            </h4>
            {riskBreakdown.mlPrediction ? (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Model: {riskBreakdown.mlPrediction.model}
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Probability</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {((riskBreakdown.mlPrediction.probability ?? 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Confidence</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {((riskBreakdown.mlPrediction.confidence ?? 0) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">No ML prediction available</p>
            )}
          </div>
        </div>
      </div>

      {/* Triggered Rules */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Triggered Rules ({riskBreakdown.triggeredRules?.length || 0})
        </h4>
        <div className="space-y-2">
          {riskBreakdown.triggeredRules?.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
            >
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {rule.ruleName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {rule.reason}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Score: {rule.score.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
          {(!riskBreakdown.triggeredRules || riskBreakdown.triggeredRules.length === 0) && (
            <p className="text-sm text-gray-600 dark:text-gray-400">No rules triggered</p>
          )}
        </div>
      </div>
    </div>
  );
}

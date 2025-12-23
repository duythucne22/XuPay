'use client';

import { useFraudRules } from '@/hooks/api/useFraud';
import { FraudRule } from '@/types/fraud';
import { ToggleLeft, ToggleRight, Plus } from 'lucide-react';
import { useState } from 'react';

export function FraudRulesContainer() {
  const { data: rules, loading, error } = useFraudRules();
  const [isCreating, setIsCreating] = useState(false);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-sm text-red-700 dark:text-red-300">
          Failed to load fraud rules. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create New Rule Button */}
      <button
        onClick={() => setIsCreating(!isCreating)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create Rule
      </button>

      {/* Create Rule Form */}
      {isCreating && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-800 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Create New Rule</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Rule Name"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg"
            />
            <input
              type="text"
              placeholder="Condition (e.g., amount > 10000)"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading rules...</div>
        ) : rules && rules.length > 0 ? (
          rules.map((rule: FraudRule) => (
            <FraudRuleCard key={rule.id} rule={rule} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No fraud rules configured</div>
        )}
      </div>
    </div>
  );
}

function FraudRuleCard({ rule }: { rule: FraudRule }) {
  const [enabled, setEnabled] = useState(rule.enabled ?? true);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {rule.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {rule.condition}
          </p>
        </div>
        <button
          onClick={() => setEnabled(!enabled)}
          className="text-2xl transition-opacity hover:opacity-80"
        >
          {enabled ? (
            <ToggleRight className="w-6 h-6 text-green-600" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-gray-400" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {(rule.accuracy * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">False Positives</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {(rule.falsePositiveRate * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Action</p>
          <p className="font-semibold text-gray-900 dark:text-white capitalize">
            {rule.action}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
          <p className="font-semibold">
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              enabled
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
            }`}>
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from 'next';
import { FraudRulesContainer } from '@/components/fraud/FraudRulesContainer';

export const metadata: Metadata = {
  title: 'Fraud Detection Rules',
  description: 'Manage and configure fraud detection rules',
};

export default function FraudRulesPage() {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Fraud Detection Rules
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure and manage rules for detecting suspicious transactions
        </p>
      </div>

      <FraudRulesContainer />
    </main>
  );
}

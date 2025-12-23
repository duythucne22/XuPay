import { Metadata } from 'next';
import { FraudMetricsContainer } from '@/components/fraud/FraudMetricsContainer';
import { FlaggedTransactionsTable } from '@/components/fraud/FlaggedTransactionsTable';
import { FlaggedTransactionsMobile } from '@/components/fraud/FlaggedTransactionCardsMobile';

export const metadata: Metadata = {
  title: 'Fraud Detection Dashboard',
  description: 'Monitor and manage fraudulent transactions',
};

export default function FraudDashboardPage() {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Fraud Detection Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor suspicious transactions and manage fraud risks
        </p>
      </div>

      {/* Metrics Cards */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Metrics
        </h2>
        <FraudMetricsContainer />
      </section>

      {/* Flagged Transactions */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Flagged Transactions
        </h2>
        <FlaggedTransactionsTable />
        <FlaggedTransactionsMobile />
      </section>
    </main>
  );
}

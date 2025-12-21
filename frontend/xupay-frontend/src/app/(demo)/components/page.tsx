'use client'

import { useState } from 'react'
import { 
  KPICard, 
  StatusBadge, 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  EmptyState, 
  PageHeader, 
  LoadingSpinner, 
  ThemeToggle,
  DetailField,
  AlertItem 
} from '@/components/common'
import { StaggerContainer, FadeIn, SlideIn, ScaleIn } from '@/components/animations'
import { Wallet, CreditCard, TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react'

export default function ComponentDemoPage() {
  const [showLoading, setShowLoading] = useState(false)
  const [alerts, setAlerts] = useState([
    { id: 1, severity: 'info' as const, message: 'System update scheduled for midnight.' },
    { id: 2, severity: 'success' as const, message: 'Payment processed successfully!' },
    { id: 3, severity: 'warning' as const, message: 'Your session will expire in 5 minutes.' },
    { id: 4, severity: 'error' as const, message: 'Failed to connect to payment gateway.' },
  ])

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id))
  }

  return (
    <div className="min-h-screen bg-[var(--xupay-bg-secondary)] p-8">
      {/* Header with Theme Toggle */}
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>

      <PageHeader 
        title="Component Demo"
        description="Phase 2 atomic components showcase"
        action={
          <Button onClick={() => setShowLoading(!showLoading)}>
            Toggle Loading States
          </Button>
        }
      />

      {/* KPI Cards Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--xupay-text-primary)] mb-6">KPI Cards</h2>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Balance"
            value="$24,563.00"
            icon={Wallet}
            change={{ value: 12.5, isPositive: true }}
            isLoading={showLoading}
          />
          <KPICard
            title="Active Users"
            value="1,234"
            icon={Users}
            change={{ value: 8.3, isPositive: true }}
            isLoading={showLoading}
          />
          <KPICard
            title="Pending Transactions"
            value="56"
            icon={CreditCard}
            change={{ value: 3.2, isPositive: false }}
            isLoading={showLoading}
          />
          <KPICard
            title="Failed Payments"
            value="12"
            icon={AlertTriangle}
            change={{ value: 15.7, isPositive: false }}
            isLoading={showLoading}
          />
        </StaggerContainer>
      </section>

      {/* Status Badges Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--xupay-text-primary)] mb-6">Status Badges</h2>
        <FadeIn>
          <Card>
            <CardHeader>
              <CardTitle>Status Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-[var(--xupay-text-muted)]">Solid (Default)</p>
                  <div className="flex gap-2">
                    <StatusBadge status="completed" />
                    <StatusBadge status="pending" />
                    <StatusBadge status="failed" />
                    <StatusBadge status="active" />
                    <StatusBadge status="inactive" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[var(--xupay-text-muted)]">Outline</p>
                  <div className="flex gap-2">
                    <StatusBadge status="completed" variant="outline" />
                    <StatusBadge status="pending" variant="outline" />
                    <StatusBadge status="failed" variant="outline" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[var(--xupay-text-muted)]">Sizes</p>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="active" size="sm" />
                    <StatusBadge status="active" size="md" />
                    <StatusBadge status="active" size="lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--xupay-text-primary)] mb-6">Buttons</h2>
        <SlideIn direction="left">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>
        </SlideIn>
      </section>

      {/* Alert Items Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--xupay-text-primary)] mb-6">Alert Items</h2>
        <ScaleIn>
          <div className="space-y-3 max-w-2xl">
            {alerts.map((alert) => (
              <AlertItem
                key={alert.id}
                severity={alert.severity}
                message={alert.message}
                onDismiss={() => dismissAlert(alert.id)}
              />
            ))}
            {alerts.length === 0 && (
              <p className="text-[var(--xupay-text-muted)] text-center py-4">
                All alerts dismissed!
              </p>
            )}
          </div>
        </ScaleIn>
      </section>

      {/* Detail Fields Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--xupay-text-primary)] mb-6">Detail Fields</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailField label="Transaction ID" value="TXN-2024-001234" />
            <DetailField label="Amount" value="$1,250.00" />
            <DetailField label="Status" value={<StatusBadge status="completed" size="sm" />} />
            <DetailField label="Date" value="Jan 15, 2024" />
            <DetailField label="Reference" value="N/A" isMuted />
          </CardContent>
        </Card>
      </section>

      {/* Loading Spinner Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--xupay-text-primary)] mb-6">Loading States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Small</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Medium (with message)</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingSpinner size="md" message="Loading data..." />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Large</CardTitle>
            </CardHeader>
            <CardContent>
              <LoadingSpinner size="lg" message="Processing payment..." />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Empty State Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[var(--xupay-text-primary)] mb-6">Empty States</h2>
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={<DollarSign className="w-16 h-16 text-[var(--xupay-text-muted)]" />}
              title="No transactions yet"
              description="Your transaction history will appear here once you make your first payment."
              primaryAction={{
                label: "Make a Payment",
                onClick: () => alert('Make Payment clicked!'),
              }}
              secondaryAction={{
                label: "Learn More",
                onClick: () => alert('Learn More clicked!'),
              }}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

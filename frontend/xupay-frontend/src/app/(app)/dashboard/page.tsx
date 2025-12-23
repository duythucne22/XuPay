import React from 'react'
import Container from '@/components/ui/Container'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-white text-gray-900">
      <Container>
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview — desktop-first, clean layout.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost">Export</Button>
            <Button>New Transfer</Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">$12,450.00</div>
              <div className="text-sm text-gray-500 mt-2">Available balance across wallets</div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">$2,345</div>
              <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">$840</div>
              <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">$4,200</div>
              <div className="text-sm text-gray-500 mt-2">Target progress</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <Card className="col-span-2 p-6">
            <CardHeader>
              <CardTitle>Balance Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Chart placeholder (replace with real chart)</div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Button>Send Money</Button>
                <Button variant="ghost">Request Money</Button>
                <Button variant="ghost">Export CSV</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </Container>
    </div>
  )
}

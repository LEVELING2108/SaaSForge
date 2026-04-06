import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and payment methods</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold">Free Plan</h3>
                  <p className="text-sm text-gray-600">Basic features included</p>
                </div>
                <Button>Upgrade Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Choose the plan that fits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <PlanCard
                name="Basic"
                price="$19"
                period="/month"
                features={['5 users', 'Priority support', 'Advanced analytics']}
              />
              <PlanCard
                name="Pro"
                price="$49"
                period="/month"
                features={['Unlimited users', '24/7 support', 'Custom integrations', 'API access']}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">No payment history yet</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function PlanCard({ name, price, period, features }: { 
  name: string; 
  price: string; 
  period: string; 
  features: string[];
}) {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold">{name}</h3>
      <div>
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-gray-600">{period}</span>
      </div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <span className="text-green-500 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button className="w-full" variant="outline">
        Upgrade to {name}
      </Button>
    </div>
  )
}

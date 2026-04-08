'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { subscriptionService } from '@/lib/api'
import { useToast } from '@/components/ui/toaster'
import { Loader2, Check, CreditCard } from 'lucide-react'

interface Plan {
  name: string
  price: string
  period: string
  priceId: string
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    name: 'Basic',
    price: '$19',
    period: '/month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || 'price_basic_123',
    features: [
      '5 users',
      'Priority support',
      'Advanced analytics',
      '10 GB storage',
      'API access',
    ],
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_456',
    features: [
      'Unlimited users',
      '24/7 support',
      'Custom integrations',
      'API access',
      '100 GB storage',
      'Advanced security',
      'Custom branding',
    ],
    popular: true,
  },
]

export default function BillingPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [currentPlan, setCurrentPlan] = useState('Free')
  const [isLoading, setIsLoading] = useState(false)
  const [isPortalLoading, setIsPortalLoading] = useState(false)

  const handleUpgrade = async (plan: Plan) => {
    setIsLoading(true)
    try {
      const baseUrl = window.location.origin
      const response = await subscriptionService.createCheckoutSession(
        plan.priceId,
        `${baseUrl}/dashboard/billing?success=true`,
        `${baseUrl}/dashboard/billing?canceled=true`
      )

      // Redirect to Stripe Checkout
      window.location.href = response.url
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create checkout session',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setIsPortalLoading(true)
    try {
      const response = await subscriptionService.createPortalSession()
      window.location.href = response.url
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create billing portal session',
        variant: 'destructive',
      })
    } finally {
      setIsPortalLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and payment methods</p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold">{currentPlan} Plan</h3>
                  <p className="text-sm text-gray-600">
                    {currentPlan === 'Free'
                      ? 'Basic features included'
                      : `Thank you for being a ${currentPlan} subscriber!`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {currentPlan !== 'Free' && (
                    <Button
                      variant="outline"
                      onClick={handleManageBilling}
                      disabled={isPortalLoading}
                    >
                      {isPortalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Billing
                    </Button>
                  )}
                  {currentPlan === 'Free' && (
                    <Button onClick={() => handleUpgrade(plans[0])}>
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Choose the plan that fits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  currentPlan={currentPlan}
                  isLoading={isLoading}
                  onUpgrade={handleUpgrade}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              No payment history yet. Upgrade your plan to see transactions here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function PlanCard({
  plan,
  currentPlan,
  isLoading,
  onUpgrade,
}: {
  plan: Plan
  currentPlan: string
  isLoading: boolean
  onUpgrade: (plan: Plan) => void
}) {
  return (
    <div
      className={`border rounded-lg p-6 space-y-4 ${
        plan.popular ? 'border-blue-500 shadow-lg relative' : ''
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold">{plan.name}</h3>
      <div>
        <span className="text-3xl font-bold">{plan.price}</span>
        <span className="text-gray-600">{plan.period}</span>
      </div>
      <ul className="space-y-2">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <Check className="text-green-500 mr-2 h-4 w-4" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        className="w-full"
        variant={plan.popular ? 'default' : 'outline'}
        onClick={() => onUpgrade(plan)}
        disabled={isLoading || currentPlan.toLowerCase() === plan.name.toLowerCase()}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : currentPlan.toLowerCase() === plan.name.toLowerCase() ? (
          'Current Plan'
        ) : (
          `Upgrade to ${plan.name}`
        )}
      </Button>
    </div>
  )
}

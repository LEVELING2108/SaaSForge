'use client'

import { useState, useEffect } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { subscriptionService, authService, api } from '@/lib/api'
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
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || '',
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
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
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
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const { toast } = useToast()
  const [currentPlan, setCurrentPlan] = useState('Free')
  const [isLoading, setIsLoading] = useState(false)
  const [isPortalLoading, setIsPortalLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const token = await getToken()
        if (token) {
           api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        const userData = await authService.getCurrentUser()
        setCurrentPlan(userData.subscription_tier || 'Free')
      } catch (error) {
        console.error('Failed to fetch user plan:', error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    if (isLoaded && user) {
      fetchUserPlan()
    }
  }, [isLoaded, user, getToken])

  const handleUpgrade = async (plan: Plan) => {
    if (!plan.priceId) {
      toast({
        title: 'Configuration Error',
        description: 'Stripe Price ID is not configured.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const baseUrl = window.location.origin
      const response = await subscriptionService.createCheckoutSession(
        plan.priceId,
        `${baseUrl}/dashboard/billing?success=true`,
        `${baseUrl}/dashboard/billing?canceled=true`
      )

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

  if (isInitialLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    )
  }

  const formattedPlan = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1).toLowerCase()

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
                  <h3 className="text-lg font-semibold">{formattedPlan} Plan</h3>
                  <p className="text-sm text-gray-600">
                    {formattedPlan === 'Free'
                      ? 'Basic features included'
                      : `Thank you for being a ${formattedPlan} subscriber!`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {formattedPlan !== 'Free' && (
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
                  {formattedPlan === 'Free' && (
                    <Button onClick={() => handleUpgrade(plans[0])} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                  currentPlan={formattedPlan}
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
  const isCurrent = currentPlan.toLowerCase() === plan.name.toLowerCase()

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
        disabled={isLoading || isCurrent}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isCurrent ? (
          'Current Plan'
        ) : (
          `Upgrade to ${plan.name}`
        )}
      </Button>
    </div>
  )
}

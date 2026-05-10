'use client'

import { useState, useEffect } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { BarChart3, Users, DollarSign, TrendingUp } from 'lucide-react'

export default function DashboardClient() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [stats, setStats] = useState({
    total_users: 0,
    new_users_this_week: 0,
    subscription_tier: 'free',
    account_status: 'active',
  })
  const [activities, setActivities] = useState<any[]>([])
  const [growthData, setGrowthData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard data from backend
    const fetchData = async () => {
      try {
        const token = await getToken()
        const headers = {
          'Authorization': `Bearer ${token}`,
        }

        // Fetch stats, activity and growth concurrently
        const [statsRes, activityRes, growthRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/stats`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/activity`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/stats/growth`, { headers })
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (activityRes.ok) {
          const activityData = await activityRes.json()
          setActivities(activityData.activities)
        }

        if (growthRes.ok) {
          const growth = await growthRes.json()
          setGrowthData(growth.growth)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user])

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'User'}! 👋</h1>
          <p className="text-gray-600 mt-2">Here&apos;s what&apos;s happening with your account today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.total_users.toString()}
            icon={Users}
            description="Total registered users"
          />
          <StatCard
            title="New This Week"
            value={stats.new_users_this_week.toString()}
            icon={TrendingUp}
            description="Users joined this week"
          />
          <StatCard
            title="Subscription"
            value={stats.subscription_tier.toUpperCase()}
            icon={DollarSign}
            description="Current plan"
          />
          <StatCard
            title="Status"
            value={stats.account_status}
            icon={BarChart3}
            description="Account status"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and subscription</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline">Upgrade Plan</Button>
            <Button variant="outline">View Billing</Button>
            <Button variant="outline">API Keys</Button>
            <Button variant="outline">Team Settings</Button>
            <Button variant="outline">Integrations</Button>
            <Button variant="outline">View Logs</Button>
          </CardContent>
        </Card>

        {/* Analytics & Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trend</CardTitle>
              <CardDescription>User registrations (last 30 days)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border-t">
              {growthData.length > 0 ? (
                <div className="text-muted-foreground text-sm">
                  {/* You can integrate Recharts or Chart.js here */}
                  [ Chart Data Ready: {growthData.length} days of data ]
                </div>
              ) : (
                <p className="text-gray-500">No growth data available yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <ActivityItem 
                      key={activity.id} 
                      action={activity.action} 
                      time={new Date(activity.timestamp).toLocaleString()} 
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon: Icon, description }: { 
  title: string; 
  value: string; 
  icon: any; 
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ action, time }: { action: string; time: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium">{action}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  )
}

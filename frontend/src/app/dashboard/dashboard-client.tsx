'use client'

import { useState, useEffect } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { BarChart3, Users, DollarSign, TrendingUp, ArrowRight } from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import Link from 'next/link'

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
          // Format date for the chart
          const formattedGrowth = growth.growth.map((item: any) => ({
            ...item,
            formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }))
          setGrowthData(formattedGrowth)
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl font-medium">Loading Dashboard...</div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'User'}! 👋</h1>
            <p className="text-muted-foreground mt-1">Here&apos;s a quick overview of your system.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/billing">
              <Button size="sm">
                {stats.subscription_tier === 'pro' ? 'Manage Billing' : 'Upgrade to Pro'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.total_users.toString()}
            icon={Users}
            description="Total registered users"
            trend="+12% from last month"
          />
          <StatCard
            title="New This Week"
            value={stats.new_users_this_week.toString()}
            icon={TrendingUp}
            description="Users joined this week"
            trend="+5% from last week"
          />
          <StatCard
            title="Subscription"
            value={stats.subscription_tier.toUpperCase()}
            icon={DollarSign}
            description="Current plan tier"
            color={stats.subscription_tier === 'pro' ? 'text-indigo-600' : 'text-gray-600'}
          />
          <StatCard
            title="Account Status"
            value={stats.account_status.charAt(0).toUpperCase() + stats.account_status.slice(1)}
            icon={BarChart3}
            description="Current system status"
            color="text-green-600"
          />
        </div>

        {/* Analytics & Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Growth Trend</CardTitle>
                <CardDescription>User registrations (last 30 days)</CardDescription>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px] w-full">
                {growthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="formattedDate" 
                        axisLine={false}
                        tickLine={false}
                        tick={{fontSize: 12, fill: '#888'}}
                        minTickGap={30}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{fontSize: 12, fill: '#888'}}
                      />
                      <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                        itemStyle={{color: '#6366f1', fontWeight: 'bold'}}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground italic">
                    No registration data available yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <ActivityItem 
                      key={activity.id} 
                      action={activity.action} 
                      time={new Date(activity.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} 
                      type={activity.entity_type}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground italic">
                    No recent activity found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>System Management</CardTitle>
            <CardDescription>Quick access to common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickActionButton label="Team Members" href="/dashboard/team" />
            <QuickActionButton label="Billing Portal" href="/dashboard/billing" />
            <QuickActionButton label="Profile Settings" href="/dashboard/settings" />
            <QuickActionButton label="API Documentation" href="http://localhost:8000/docs" external />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon: Icon, description, trend, color }: { 
  title: string; 
  value: string; 
  icon: any; 
  description: string;
  trend?: string;
  color?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color || 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <p className="text-xs text-green-600 mt-2 font-medium">{trend}</p>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityItem({ action, time, type }: { action: string; time: string; type: string }) {
  return (
    <div className="relative pl-6 pb-6 border-l last:pb-0 border-gray-100">
      <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-indigo-500" />
      <div>
        <p className="text-sm font-semibold text-gray-900">{action}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
            {type || 'system'}
          </span>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
    </div>
  )
}

function QuickActionButton({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const content = (
    <Button variant="outline" className="w-full justify-between group">
      {label}
      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Button>
  )

  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>
  }

  return <Link href={href}>{content}</Link>
}

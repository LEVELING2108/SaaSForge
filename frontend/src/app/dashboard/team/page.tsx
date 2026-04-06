import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TeamPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Team Members</h1>
            <p className="text-gray-600 mt-2">Manage your team and collaborators</p>
          </div>
          <Button>Invite Member</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>Your current team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TeamMember
                name="You"
                email="you@example.com"
                role="Owner"
                isCurrentUser={true}
              />
              <p className="text-gray-500 text-center py-8">No other team members yet. Invite your first team member!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function TeamMember({ name, email, role, isCurrentUser }: { 
  name: string; 
  email: string; 
  role: string;
  isCurrentUser?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {name[0]}
        </div>
        <div>
          <p className="font-medium">{name} {isCurrentUser && '(You)'}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {role}
        </span>
      </div>
    </div>
  )
}

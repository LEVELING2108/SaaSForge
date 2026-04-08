'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { teamService } from '@/lib/api'
import { useToast } from '@/components/ui/toaster'
import { Loader2, Mail, Trash2 } from 'lucide-react'

interface TeamMember {
  id: number
  email: string
  full_name: string | null
  role: string
  avatar_url: string | null
}

export default function TeamPage() {
  const { toast } = useToast()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      const data = await teamService.getMembers()
      setMembers(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to load team members',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) {
      toast({ title: 'Error', description: 'Email is required', variant: 'destructive' })
      return
    }

    setIsInviting(true)
    try {
      await teamService.inviteMember(inviteEmail, inviteRole)
      toast({ title: 'Success', description: `Invitation sent to ${inviteEmail}` })
      setShowInviteDialog(false)
      setInviteEmail('')
      setInviteRole('member')
      await loadMembers()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to invite member',
        variant: 'destructive',
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    try {
      await teamService.removeMember(memberId)
      toast({ title: 'Success', description: 'Team member removed' })
      await loadMembers()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to remove member',
        variant: 'destructive',
      })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'bg-purple-100 text-purple-800'
      case 'admin':
        return 'bg-blue-100 text-blue-800'
      case 'member':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Team Members</h1>
            <p className="text-gray-600 mt-2">Manage your team and collaborators</p>
          </div>
          <Button onClick={() => setShowInviteDialog(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>Your current team members ({members.length})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => (
                <TeamMember
                  key={member.id}
                  member={member}
                  isCurrentUser={members.indexOf(member) === 0}
                  onRemove={() => handleRemoveMember(member.id)}
                  getRoleColor={getRoleColor}
                />
              ))}
              {members.length === 1 && (
                <p className="text-gray-500 text-center py-8">
                  No other team members yet. Invite your first team member!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Invite Member Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isInviting}>
                  {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Invitation
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

function TeamMember({
  member,
  isCurrentUser,
  onRemove,
  getRoleColor,
}: {
  member: TeamMember
  isCurrentUser: boolean
  onRemove: () => void
  getRoleColor: (role: string) => string
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {member.full_name?.[0] || member.email[0]}
        </div>
        <div>
          <p className="font-medium">
            {member.full_name || member.email.split('@')[0]}
            {isCurrentUser && ' (You)'}
          </p>
          <p className="text-sm text-gray-500">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-3 py-1 rounded-full text-sm ${getRoleColor(member.role)}`}>
          {member.role}
        </span>
        {!isCurrentUser && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

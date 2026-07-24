"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Users, Trash2, Crown, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Navbar } from "@/components/navbar"

const roles = [
  {
    id: "owner",
    name: "Owner",
    color: "text-red-500",
    permissions: ["All Permissions"],
    memberCount: 1,
  },
  {
    id: "admin",
    name: "Admin",
    color: "text-orange-500",
    permissions: ["Manage Channels", "Manage Members", "Moderate Content", "Manage Events"],
    memberCount: 3,
  },
  {
    id: "moderator",
    name: "Moderator",
    color: "text-blue-500",
    permissions: ["Moderate Content", "Manage Messages", "Timeout Members"],
    memberCount: 8,
  },
  {
    id: "member",
    name: "Member",
    color: "text-gray-500",
    permissions: ["Send Messages", "Read Channels", "Join Events"],
    memberCount: 1222,
  },
]

const members = [
  {
    id: "1",
    name: "Sarah Chen",
    username: "sarahwrites",
    avatar: "/user-avatar-1.jpg",
    role: "owner",
    joinedAt: "Jan 2024",
  },
  {
    id: "2",
    name: "Mike Johnson",
    username: "mikej",
    avatar: "/user-avatar-2.jpg",
    role: "admin",
    joinedAt: "Jan 2024",
  },
  {
    id: "3",
    name: "Emma Davis",
    username: "emmareads",
    avatar: "/user-avatar-3.jpg",
    role: "moderator",
    joinedAt: "Feb 2024",
  },
]

export default function CommunitySettingsPage({ params }: { params: { id: string } }) {
  const [selectedRole, setSelectedRole] = useState(roles[0])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-8">
          <Link href={`/communities/${params.id}`}>
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Community
            </Button>
          </Link>
          <h1 className="text-3xl sm:text-3xl font-bold">Community Settings</h1>
          <p className="mt-2 text-muted-foreground sm:text-base">
            Manage your community members, roles, and permissions
          </p>
        </div>

        <Tabs defaultValue="members" className="space-y-6 sm:space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="members" className="text-xs sm:text-sm">
              Members
            </TabsTrigger>
            <TabsTrigger value="roles" className="text-xs sm:text-sm">
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger value="moderation" className="text-xs sm:text-sm">
              Moderation
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Community Members</CardTitle>
                    <CardDescription>Manage member roles and permissions</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Users className="h-4 w-4" />
                    Invite Members
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Link href={`/profile/${member.username}`}>
                          <Avatar className="h-12 w-12 cursor-pointer">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link href={`/profile/${member.username}`} className="font-semibold hover:underline">
                              {member.name}
                            </Link>
                            {member.role === "owner" && <Crown className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">@{member.username}</p>
                          <p className="text-xs text-muted-foreground mt-1">Joined {member.joinedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Select defaultValue={member.role}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <UserCog className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Timeout</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Kick from Community</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Ban User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Roles List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Roles</CardTitle>
                  <CardDescription>Select a role to edit permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role)}
                        className={`flex w-full items-center justify-between rounded-lg border p-3 transition-colors ${
                          selectedRole.id === role.id ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className={`h-4 w-4 ${role.color}`} />
                          <span className="font-medium">{role.name}</span>
                        </div>
                        <Badge variant="secondary">{role.memberCount}</Badge>
                      </button>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    Create New Role
                  </Button>
                </CardContent>
              </Card>

              {/* Role Permissions */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className={`h-5 w-5 ${selectedRole.color}`} />
                        {selectedRole.name} Permissions
                      </CardTitle>
                      <CardDescription>{selectedRole.memberCount} members with this role</CardDescription>
                    </div>
                    {selectedRole.id !== "owner" && selectedRole.id !== "member" && (
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* General Permissions */}
                  <div>
                    <h3 className="font-semibold mb-3">General Permissions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="view-channels">View Channels</Label>
                        <Switch id="view-channels" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="send-messages">Send Messages</Label>
                        <Switch id="send-messages" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="create-events">Create Events</Label>
                        <Switch id="create-events" />
                      </div>
                    </div>
                  </div>

                  {/* Management Permissions */}
                  <div>
                    <h3 className="font-semibold mb-3">Management Permissions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manage-channels">Manage Channels</Label>
                        <Switch id="manage-channels" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manage-members">Manage Members</Label>
                        <Switch id="manage-members" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="manage-events">Manage Events</Label>
                        <Switch id="manage-events" />
                      </div>
                    </div>
                  </div>

                  {/* Moderation Permissions */}
                  <div>
                    <h3 className="font-semibold mb-3">Moderation Permissions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="delete-messages">Delete Messages</Label>
                        <Switch id="delete-messages" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="timeout-members">Timeout Members</Label>
                        <Switch id="timeout-members" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="kick-members">Kick Members</Label>
                        <Switch id="kick-members" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ban-members">Ban Members</Label>
                        <Switch id="ban-members" />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Save Permissions</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Settings</CardTitle>
                <CardDescription>Configure automated moderation and content filters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-mod">Auto-Moderation</Label>
                    <p className="text-sm text-muted-foreground">Automatically filter inappropriate content</p>
                  </div>
                  <Switch id="auto-mod" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="spam-filter">Spam Filter</Label>
                    <p className="text-sm text-muted-foreground">Block spam and repeated messages</p>
                  </div>
                  <Switch id="spam-filter" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="link-filter">Link Filter</Label>
                    <p className="text-sm text-muted-foreground">Require approval for external links</p>
                  </div>
                  <Switch id="link-filter" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="slow-mode">Slow Mode</Label>
                    <p className="text-sm text-muted-foreground">Limit message frequency per user</p>
                  </div>
                  <Switch id="slow-mode" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Banned Members</CardTitle>
                <CardDescription>Users who have been banned from this community</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">No banned members</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

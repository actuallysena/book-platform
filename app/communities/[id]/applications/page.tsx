"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const pendingApplications = [
  {
    id: "1",
    user: {
      name: "Alex Thompson",
      username: "alexthompson",
      avatar: "/user-avatar-1.jpg",
      bio: "Fantasy writer and avid reader. Love epic world-building and character development.",
      booksPublished: 3,
      followers: 245,
    },
    appliedAt: "2 hours ago",
    message:
      "I've been writing fantasy for 5 years and would love to join this community to connect with other writers and get feedback on my work.",
  },
  {
    id: "2",
    user: {
      name: "Jordan Lee",
      username: "jordanlee",
      avatar: "/user-avatar-2.jpg",
      bio: "Passionate about sci-fi and speculative fiction. Currently working on my first novel.",
      booksPublished: 1,
      followers: 89,
    },
    appliedAt: "5 hours ago",
    message: "I'm excited to learn from experienced writers and share my own stories with the community.",
  },
]

const approvedApplications = [
  {
    id: "3",
    user: {
      name: "Sam Rivera",
      username: "samrivera",
      avatar: "/user-avatar-3.jpg",
    },
    appliedAt: "1 day ago",
    approvedAt: "1 day ago",
    approvedBy: "Sarah Chen",
  },
]

const rejectedApplications = [
  {
    id: "4",
    user: {
      name: "Casey Morgan",
      username: "caseymorgan",
      avatar: "/user-avatar-1.jpg",
    },
    appliedAt: "2 days ago",
    rejectedAt: "2 days ago",
    rejectedBy: "Sarah Chen",
    reason: "Application did not meet community guidelines",
  },
]

export default function ApplicationsPage({ params }: { params: { id: string } }) {
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState<string | null>(null)

  const handleApprove = (applicationId: string) => {
    console.log("[v0] Approving application:", applicationId)
  }

  const handleReject = (applicationId: string) => {
    console.log("[v0] Rejecting application:", applicationId, "Reason:", rejectReason)
    setShowRejectDialog(null)
    setRejectReason("")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/communities/${params.id}/settings`}>
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Membership Applications</h1>
          <p className="mt-2 text-muted-foreground">Review and manage applications to join your community</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending
              {pendingApplications.length > 0 && (
                <Badge variant="default" className="ml-2">
                  {pendingApplications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {/* Pending Applications */}
          <TabsContent value="pending" className="space-y-4">
            {pendingApplications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending applications</h3>
                  <p className="text-muted-foreground text-center">New applications will appear here for review</p>
                </CardContent>
              </Card>
            ) : (
              pendingApplications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Link href={`/profile/${application.user.username}`}>
                        <Avatar className="h-16 w-16 cursor-pointer">
                          <AvatarImage src={application.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{application.user.name[0]}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/profile/${application.user.username}`}
                              className="text-xl font-semibold hover:underline"
                            >
                              {application.user.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">@{application.user.username}</p>
                          </div>
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            {application.appliedAt}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{application.user.bio}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{application.user.booksPublished} books published</span>
                          <span>{application.user.followers} followers</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Application Message</Label>
                      <p className="text-sm text-muted-foreground mt-1">{application.message}</p>
                    </div>

                    {showRejectDialog === application.id ? (
                      <div className="space-y-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                        <Label htmlFor="reject-reason">Rejection Reason (optional)</Label>
                        <Textarea
                          id="reject-reason"
                          placeholder="Explain why this application is being rejected..."
                          rows={3}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(application.id)}
                            className="flex-1"
                          >
                            Confirm Rejection
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowRejectDialog(null)
                              setRejectReason("")
                            }}
                            className="flex-1 bg-transparent"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2" onClick={() => handleApprove(application.id)}>
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 gap-2 bg-transparent"
                          onClick={() => setShowRejectDialog(application.id)}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                        <Link href={`/profile/${application.user.username}`}>
                          <Button variant="ghost">View Profile</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Approved Applications */}
          <TabsContent value="approved" className="space-y-4">
            {approvedApplications.map((application) => (
              <Card key={application.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <Link href={`/profile/${application.user.username}`}>
                      <Avatar className="h-12 w-12 cursor-pointer">
                        <AvatarImage src={application.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{application.user.name[0]}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link href={`/profile/${application.user.username}`} className="font-semibold hover:underline">
                        {application.user.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Approved by {application.approvedBy} • {application.approvedAt}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    <Check className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Rejected Applications */}
          <TabsContent value="rejected" className="space-y-4">
            {rejectedApplications.map((application) => (
              <Card key={application.id}>
                <CardContent className="py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Link href={`/profile/${application.user.username}`}>
                        <Avatar className="h-12 w-12 cursor-pointer">
                          <AvatarImage src={application.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{application.user.name[0]}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div>
                        <Link href={`/profile/${application.user.username}`} className="font-semibold hover:underline">
                          {application.user.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Rejected by {application.rejectedBy} • {application.rejectedAt}
                        </p>
                      </div>
                    </div>
                    <Badge variant="destructive">
                      <X className="h-3 w-3 mr-1" />
                      Rejected
                    </Badge>
                  </div>
                  {application.reason && (
                    <div className="ml-16">
                      <Label className="text-xs text-muted-foreground">Rejection Reason</Label>
                      <p className="text-sm mt-1">{application.reason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

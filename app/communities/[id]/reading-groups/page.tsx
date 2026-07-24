"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Calendar, Users, Plus, TrendingUp, MessageSquare, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const readingGroups = [
  {
    id: "1",
    name: "March Fantasy Challenge",
    book: {
      id: "1",
      title: "The Shadow's Edge",
      author: "Sarah Chen",
      cover: "/fantasy-book-cover-with-guardian.jpg",
    },
    startDate: "Mar 1, 2024",
    endDate: "Mar 31, 2024",
    participants: 45,
    status: "active" as const,
    progress: 65,
    currentChapter: 12,
    totalChapters: 18,
    discussions: 23,
  },
  {
    id: "2",
    name: "Sci-Fi Book Club",
    book: {
      id: "2",
      title: "Quantum Dreams",
      author: "Mike Johnson",
      cover: "/sci-fi-book-cover-futuristic.jpg",
    },
    startDate: "Feb 15, 2024",
    endDate: "Mar 15, 2024",
    participants: 32,
    status: "active" as const,
    progress: 90,
    currentChapter: 20,
    totalChapters: 22,
    discussions: 45,
  },
  {
    id: "3",
    name: "Romance Readers Unite",
    book: {
      id: "3",
      title: "Hearts Entwined",
      author: "Emma Davis",
      cover: "/romance-book-cover-couple.jpg",
    },
    startDate: "Apr 1, 2024",
    endDate: "Apr 30, 2024",
    participants: 28,
    status: "upcoming" as const,
    progress: 0,
    currentChapter: 0,
    totalChapters: 25,
    discussions: 2,
  },
]

const leaderboard = [
  {
    id: "1",
    user: { name: "Sarah Chen", username: "sarahwrites", avatar: "/user-avatar-1.jpg" },
    chaptersRead: 45,
    commentsPosted: 23,
    likesReceived: 156,
  },
  {
    id: "2",
    user: { name: "Mike Johnson", username: "mikej", avatar: "/user-avatar-2.jpg" },
    chaptersRead: 42,
    commentsPosted: 31,
    likesReceived: 142,
  },
  {
    id: "3",
    user: { name: "Emma Davis", username: "emmareads", avatar: "/user-avatar-3.jpg" },
    chaptersRead: 38,
    commentsPosted: 28,
    likesReceived: 134,
  },
]

export default function ReadingGroupsPage({ params }: { params: { id: string } }) {
  const [selectedTab, setSelectedTab] = useState("active")

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/communities/${params.id}`}>
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Community
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reading Groups</h1>
              <p className="mt-2 text-muted-foreground">Join reading challenges and discuss books with the community</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Reading Group
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4 mt-6">
                {readingGroups
                  .filter((group) => group.status === "active")
                  .map((group) => (
                    <Card key={group.id}>
                      <CardHeader>
                        <div className="flex gap-4">
                          <img
                            src={group.book.cover || "/placeholder.svg"}
                            alt={group.book.title}
                            className="h-32 w-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl">{group.name}</CardTitle>
                                <CardDescription className="mt-1">
                                  Reading <span className="font-medium text-foreground">{group.book.title}</span> by{" "}
                                  {group.book.author}
                                </CardDescription>
                              </div>
                              <Badge>Active</Badge>
                            </div>
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {group.startDate} - {group.endDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {group.participants} participants
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {group.discussions} discussions
                                </span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Chapter {group.currentChapter} of {group.totalChapters}
                                  </span>
                                  <span className="font-medium">{group.progress}%</span>
                                </div>
                                <Progress value={group.progress} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Link href={`/communities/${params.id}/reading-groups/${group.id}`} className="flex-1">
                            <Button className="w-full">View Details</Button>
                          </Link>
                          <Link href={`/read/${group.book.id}/1`} className="flex-1">
                            <Button variant="outline" className="w-full bg-transparent">
                              Continue Reading
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-4 mt-6">
                {readingGroups
                  .filter((group) => group.status === "upcoming")
                  .map((group) => (
                    <Card key={group.id}>
                      <CardHeader>
                        <div className="flex gap-4">
                          <img
                            src={group.book.cover || "/placeholder.svg"}
                            alt={group.book.title}
                            className="h-32 w-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl">{group.name}</CardTitle>
                                <CardDescription className="mt-1">
                                  Reading <span className="font-medium text-foreground">{group.book.title}</span> by{" "}
                                  {group.book.author}
                                </CardDescription>
                              </div>
                              <Badge variant="secondary">Upcoming</Badge>
                            </div>
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Starts {group.startDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {group.participants} joined
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">Join Reading Group</Button>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No completed reading groups yet</h3>
                    <p className="text-muted-foreground text-center">Completed reading groups will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Readers
                </CardTitle>
                <CardDescription>Most active members this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {index + 1}
                      </div>
                      <Link href={`/profile/${entry.user.username}`}>
                        <Avatar className="h-10 w-10 cursor-pointer">
                          <AvatarImage src={entry.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/profile/${entry.user.username}`}
                          className="font-medium hover:underline block truncate"
                        >
                          {entry.user.name}
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {entry.chaptersRead}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {entry.commentsPosted}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {entry.likesReceived}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Groups Joined</span>
                  <span className="text-2xl font-bold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Chapters Read</span>
                  <span className="text-2xl font-bold">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Comments Posted</span>
                  <span className="text-2xl font-bold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Likes Received</span>
                  <span className="text-2xl font-bold">156</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

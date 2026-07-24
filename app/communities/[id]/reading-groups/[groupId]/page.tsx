"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Calendar, Users, MessageSquare, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

const readingGroup = {
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
  progress: 65,
  currentChapter: 12,
  totalChapters: 18,
}

const schedule = [
  { week: 1, chapters: "1-3", status: "completed" as const, dueDate: "Mar 7" },
  { week: 2, chapters: "4-6", status: "completed" as const, dueDate: "Mar 14" },
  { week: 3, chapters: "7-9", status: "completed" as const, dueDate: "Mar 21" },
  { week: 4, chapters: "10-12", status: "current" as const, dueDate: "Mar 28" },
  { week: 5, chapters: "13-15", status: "upcoming" as const, dueDate: "Apr 4" },
  { week: 6, chapters: "16-18", status: "upcoming" as const, dueDate: "Apr 11" },
]

const discussions = [
  {
    id: "1",
    chapter: "Chapter 12",
    title: "What did you think about the plot twist?",
    author: { name: "Sarah Chen", username: "sarahwrites", avatar: "/user-avatar-1.jpg" },
    replies: 15,
    likes: 23,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    chapter: "Chapter 11",
    title: "The character development is amazing!",
    author: { name: "Mike Johnson", username: "mikej", avatar: "/user-avatar-2.jpg" },
    replies: 8,
    likes: 12,
    timestamp: "5 hours ago",
  },
]

const participants = [
  { id: "1", name: "Sarah Chen", username: "sarahwrites", avatar: "/user-avatar-1.jpg", progress: 100 },
  { id: "2", name: "Mike Johnson", username: "mikej", avatar: "/user-avatar-2.jpg", progress: 95 },
  { id: "3", name: "Emma Davis", username: "emmareads", avatar: "/user-avatar-3.jpg", progress: 85 },
]

export default function ReadingGroupDetailPage({ params }: { params: { id: string; groupId: string } }) {
  const [newDiscussion, setNewDiscussion] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/communities/${params.id}/reading-groups`}>
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Reading Groups
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={readingGroup.book.cover || "/placeholder.svg"}
              alt={readingGroup.book.title}
              className="h-64 w-48 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{readingGroup.name}</h1>
              <p className="mt-2 text-xl text-muted-foreground">
                {readingGroup.book.title} by {readingGroup.book.author}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {readingGroup.startDate} - {readingGroup.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {readingGroup.participants} participants
                </span>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Chapter {readingGroup.currentChapter} of {readingGroup.totalChapters}
                  </span>
                  <span className="font-medium">{readingGroup.progress}%</span>
                </div>
                <Progress value={readingGroup.progress} className="h-2" />
              </div>
              <div className="mt-6 flex gap-3">
                <Link href={`/read/${readingGroup.book.id}/1`}>
                  <Button className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Continue Reading
                  </Button>
                </Link>
                <Button variant="outline" className="bg-transparent">
                  Leave Group
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="schedule">
              <TabsList>
                <TabsTrigger value="schedule">Reading Schedule</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>

              <TabsContent value="schedule" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reading Schedule</CardTitle>
                    <CardDescription>Follow along with the group reading schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {schedule.map((item) => (
                        <div
                          key={item.week}
                          className={`flex items-center justify-between rounded-lg border p-4 ${
                            item.status === "current" ? "border-primary bg-primary/5" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                              <p className="font-medium">
                                Week {item.week}: Chapters {item.chapters}
                              </p>
                              <p className="text-sm text-muted-foreground">Due {item.dueDate}</p>
                            </div>
                          </div>
                          {item.status === "current" && <Badge>Current</Badge>}
                          {item.status === "completed" && <Badge variant="secondary">Completed</Badge>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussions" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Start a Discussion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts about the current chapters..."
                      rows={3}
                      value={newDiscussion}
                      onChange={(e) => setNewDiscussion(e.target.value)}
                    />
                    <Button>Post Discussion</Button>
                  </CardContent>
                </Card>

                {discussions.map((discussion) => (
                  <Card key={discussion.id}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Link href={`/profile/${discussion.author.username}`}>
                          <Avatar className="h-10 w-10 cursor-pointer">
                            <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/profile/${discussion.author.username}`}
                              className="font-semibold hover:underline"
                            >
                              {discussion.author.name}
                            </Link>
                            <span className="text-sm text-muted-foreground">{discussion.timestamp}</span>
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            {discussion.chapter}
                          </Badge>
                          <CardTitle className="text-lg mt-2">{discussion.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {discussion.replies} replies
                        </span>
                        <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                          View Discussion
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
                <CardDescription>{readingGroup.participants} members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <Link href={`/profile/${participant.username}`}>
                        <Avatar className="h-10 w-10 cursor-pointer">
                          <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{participant.name[0]}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/profile/${participant.username}`}
                          className="font-medium hover:underline block truncate"
                        >
                          {participant.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={participant.progress} className="h-1 flex-1" />
                          <span className="text-xs text-muted-foreground">{participant.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

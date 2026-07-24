"use client"

import { Navbar } from "@/components/navbar"
import { StudioSidebar } from "@/components/studio-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Heart, BookOpen, TrendingUp, Users, Clock } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data
const overviewStats = [
  { label: "Total Reads", value: "125,430", change: "+12.5%", icon: Eye, trend: "up" },
  { label: "Total Likes", value: "34,892", change: "+8.2%", icon: Heart, trend: "up" },
  { label: "Active Books", value: "8", change: "+2", icon: BookOpen, trend: "up" },
  { label: "Followers", value: "12,456", change: "+15.3%", icon: Users, trend: "up" },
]

const readsData = [
  { date: "Jan", reads: 8400 },
  { date: "Feb", reads: 9200 },
  { date: "Mar", reads: 11500 },
  { date: "Apr", reads: 13200 },
  { date: "May", reads: 15800 },
  { date: "Jun", reads: 18400 },
  { date: "Jul", reads: 21300 },
]

const bookPerformance = [
  { title: "The Last Guardian", reads: 45000, likes: 12500, chapters: 24 },
  { title: "Echoes of Tomorrow", reads: 32000, likes: 9800, chapters: 18 },
  { title: "Whispers in the Dark", reads: 28000, likes: 8900, chapters: 16 },
  { title: "Beyond the Horizon", reads: 15000, likes: 4200, chapters: 12 },
  { title: "Shadows of Eternity", reads: 5430, likes: 1492, chapters: 8 },
]

const chapterEngagement = [
  { chapter: "Ch 1", reads: 5200, completion: 92 },
  { chapter: "Ch 2", reads: 4800, completion: 88 },
  { chapter: "Ch 3", reads: 4500, completion: 85 },
  { chapter: "Ch 4", reads: 4200, completion: 82 },
  { chapter: "Ch 5", reads: 3900, completion: 78 },
  { chapter: "Ch 6", reads: 3600, completion: 75 },
]

const recentActivity = [
  { user: "Sarah M.", action: "liked", book: "The Last Guardian", time: "2 minutes ago" },
  { user: "John D.", action: "started reading", book: "Echoes of Tomorrow", time: "15 minutes ago" },
  { user: "Emma W.", action: "commented on", book: "The Last Guardian", time: "1 hour ago" },
  { user: "Michael R.", action: "added to library", book: "Whispers in the Dark", time: "2 hours ago" },
  { user: "Lisa K.", action: "finished", book: "Beyond the Horizon", time: "3 hours ago" },
]

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <StudioSidebar />

        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="mt-2 text-muted-foreground">Track your books' performance and reader engagement</p>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {overviewStats.map((stat) => (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">{stat.change}</span>
                      <span>from last month</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reads Over Time</CardTitle>
                    <CardDescription>Your total reads for the past 7 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={readsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line type="monotone" dataKey="reads" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Books</CardTitle>
                      <CardDescription>Books with the most reads this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {bookPerformance.slice(0, 3).map((book, index) => (
                          <div key={book.title} className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{book.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {book.reads.toLocaleString()} reads • {book.likes.toLocaleString()} likes
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Reading Time</CardTitle>
                      <CardDescription>Average time spent on your books</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <Clock className="h-10 w-10 text-primary" />
                          <div>
                            <p className="text-3xl font-bold">24m 32s</p>
                            <p className="text-sm text-muted-foreground">Average reading time per chapter</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Completion Rate</span>
                            <span className="font-medium">78%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: "78%" }} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Books Tab */}
              <TabsContent value="books" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Book Performance</CardTitle>
                    <CardDescription>Detailed statistics for all your books</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookPerformance.map((book) => (
                        <div
                          key={book.title}
                          className="flex items-center justify-between p-4 rounded-lg border border-border"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.chapters} chapters</p>
                          </div>
                          <div className="flex gap-8 text-sm">
                            <div className="text-center">
                              <p className="font-bold text-lg">{book.reads.toLocaleString()}</p>
                              <p className="text-muted-foreground">Reads</p>
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-lg">{book.likes.toLocaleString()}</p>
                              <p className="text-muted-foreground">Likes</p>
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-lg">{Math.round((book.likes / book.reads) * 100)}%</p>
                              <p className="text-muted-foreground">Engagement</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Engagement Tab */}
              <TabsContent value="engagement" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Chapter Engagement</CardTitle>
                    <CardDescription>Reader engagement by chapter for "The Last Guardian"</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={chapterEngagement}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="chapter" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="reads" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Completion Rates</CardTitle>
                    <CardDescription>Percentage of readers who finish each chapter</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chapterEngagement.map((chapter) => (
                        <div key={chapter.chapter} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{chapter.chapter}</span>
                            <span className="text-muted-foreground">{chapter.completion}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${chapter.completion}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest interactions with your books</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span>{" "}
                              <span className="text-muted-foreground">{activity.action}</span>{" "}
                              <span className="font-medium">{activity.book}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

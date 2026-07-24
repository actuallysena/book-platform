"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookCard } from "@/components/book-card"
import { Settings, MapPin, Calendar, BookOpen, Heart, Users } from "lucide-react"
import Link from "next/link"
import { getImageUrl } from "@/lib/api"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("books")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Derived data
  const publishedBooks = user?.books || []
  const bookmarkedBooks: any[] = []
  const recentActivity: any[] = []

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser)
      // Initial set from local logic
      setUser(parsedUser)

      // Fetch fresh data from API
      fetch(`http://localhost:3001/users/${parsedUser.id}`)
        .then(res => res.json())
        .then(data => {
          setUser(data)
          setLoading(false)
        })
        .catch(err => {
          console.error("Failed to fetch profile", err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in to view profile</div>

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Profile Header */}
        <section className="border-b border-border bg-gradient-to-b from-accent/20 to-background">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={getImageUrl(user.avatar) || "/placeholder.svg"} />
                <AvatarFallback className="text-3xl">{(user.name || user.username || "U")[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{user.name || user.username}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>

                <p className="text-foreground leading-relaxed max-w-2xl">{user.bio || "No bio yet."}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Stats (Mock for now until we have counts) */}
                <div className="flex flex-wrap gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-lg">{user.books?.length || 0}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Books</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-lg">0</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-lg">0</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Link href="/settings">
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Books Tab */}
              <TabsContent value="books" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Published Books</h2>
                  {publishedBooks.length > 0 ? (
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
                      {publishedBooks.map((book: any) => (
                        <BookCard
                          key={book.id}
                          id={book.id}
                          title={book.title}
                          author={book.author?.name || book.author?.username || "Unknown"}
                          cover={getImageUrl(book.coverImage)}
                          likes={book._count?.likes || 0}
                          reads={book.viewCount || 0}
                          comments={book._count?.comments || 0}
                          rating={0}
                          tags={book.category ? [book.category.name] : []}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No published books yet</p>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Bookmarks Tab */}
              <TabsContent value="bookmarks" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Bookmarked Books</h2>
                  {bookmarkedBooks.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {bookmarkedBooks.map((book) => (
                        <BookCard key={book.id} {...book} />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No bookmarked books yet</p>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                  <Card>
                    <CardContent className="p-0">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 hover:bg-accent transition-colors border-b last:border-b-0"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            {activity.type === "published" && <BookOpen className="h-5 w-5 text-primary" />}
                            {activity.type === "liked" && <Heart className="h-5 w-5 text-primary" />}
                            {activity.type === "bookmarked" && <BookOpen className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.text}</p>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

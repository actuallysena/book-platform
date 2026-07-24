import Link from "next/link"
import { Plus, Users, Lock, Globe, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const myCommunities = [
  {
    id: "1",
    name: "Fantasy Writers Guild",
    description: "A community for fantasy authors to share their work and get feedback",
    memberCount: 1234,
    isPrivate: false,
    role: "Admin",
    unreadCount: 5,
    avatar: "/fantasy-guild-icon.jpg",
  },
  {
    id: "2",
    name: "Romance Readers Club",
    description: "Discussing the latest romance novels and tropes",
    memberCount: 856,
    isPrivate: true,
    role: "Member",
    unreadCount: 12,
    avatar: "/romance-book-club-icon.jpg",
  },
  {
    id: "3",
    name: "Sci-Fi Book Exchange",
    description: "Monthly reading challenges and book discussions",
    memberCount: 2341,
    isPrivate: false,
    role: "Moderator",
    unreadCount: 0,
    avatar: "/scifi-books-icon.jpg",
  },
]

const discoverCommunities = [
  {
    id: "4",
    name: "Mystery Writers Network",
    description: "Connect with mystery and thriller authors worldwide",
    memberCount: 3421,
    isPrivate: false,
    tags: ["Mystery", "Thriller", "Writing"],
    avatar: "/mystery-writers-icon.jpg",
  },
  {
    id: "5",
    name: "Young Adult Authors",
    description: "For writers creating stories for young adult audiences",
    memberCount: 1876,
    isPrivate: false,
    tags: ["YA", "Teen Fiction", "Writing"],
    avatar: "/young-adult-books-icon.jpg",
  },
  {
    id: "6",
    name: "Poetry Corner",
    description: "Share and discuss poetry in all its forms",
    memberCount: 945,
    isPrivate: true,
    tags: ["Poetry", "Creative Writing"],
    avatar: "/poetry-icon.jpg",
  },
]

export default function CommunitiesPage() {
  const maxCommunities = 10
  const currentCommunityCount = myCommunities.length

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Communities</h1>
            <p className="mt-2 text-muted-foreground">
              Join communities to connect with readers and writers ({currentCommunityCount}/{maxCommunities} joined)
            </p>
          </div>
          <Link href="/communities/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Community
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="my-communities" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-communities">My Communities</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="invitations">Invitations (2)</TabsTrigger>
          </TabsList>

          {/* My Communities */}
          <TabsContent value="my-communities" className="space-y-4">
            {myCommunities.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No communities yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Join or create a community to start connecting with other readers and writers
                  </p>
                  <Link href="/communities/create">
                    <Button>Create Your First Community</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myCommunities.map((community) => (
                  <Link key={community.id} href={`/communities/${community.id}`}>
                    <Card className="h-full transition-colors hover:bg-accent">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <img
                            src={community.avatar || "/placeholder.svg"}
                            alt={community.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-lg line-clamp-1">{community.name}</CardTitle>
                              {community.isPrivate ? (
                                <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                            <CardDescription className="line-clamp-2 mt-1">{community.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {community.memberCount.toLocaleString()}
                            </span>
                            <Badge variant="secondary">{community.role}</Badge>
                          </div>
                          {community.unreadCount > 0 && (
                            <Badge variant="default" className="bg-primary">
                              {community.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Discover Communities */}
          <TabsContent value="discover" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <TrendingUp className="h-4 w-4" />
                Trending
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Clock className="h-4 w-4" />
                New
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {discoverCommunities.map((community) => (
                <Card key={community.id} className="h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <img
                        src={community.avatar || "/placeholder.svg"}
                        alt={community.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg line-clamp-1">{community.name}</CardTitle>
                          {community.isPrivate ? (
                            <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">{community.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {community.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {community.memberCount.toLocaleString()} members
                        </span>
                        {community.isPrivate ? (
                          <Button size="sm" variant="outline">
                            Request to Join
                          </Button>
                        ) : (
                          <Button size="sm">Join</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Invitations */}
          <TabsContent value="invitations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <img
                      src="/horror-writers-icon.jpg"
                      alt="Horror Writers Society"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg">Horror Writers Society</CardTitle>
                      <CardDescription className="mt-1">
                        Invited by <span className="font-medium text-foreground">@darkauthor</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    A community for horror and thriller writers to share their darkest stories
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <img
                      src="/book-club-icon.jpg"
                      alt="Monthly Book Club"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg">Monthly Book Club</CardTitle>
                      <CardDescription className="mt-1">
                        Invited by <span className="font-medium text-foreground">@bookworm23</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Read and discuss one book together every month with fellow book lovers
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

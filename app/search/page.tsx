import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookCard } from "@/components/book-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Hash, User } from "lucide-react"
import Link from "next/link"
import { fetchAPI, getImageUrl } from "@/lib/api"
import { ReportModal } from "@/components/report-modal"

export const dynamic = 'force-dynamic'

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ""
  let bookResults: any[] = []
  let profileResults: any[] = []

  try {
    if (query) {
      const [books, users] = await Promise.all([
        fetchAPI(`/books?search=${encodeURIComponent(query)}`),
        fetchAPI(`/users?search=${encodeURIComponent(query)}`)
      ])
      bookResults = books
      profileResults = users
    }
  } catch (error) {
    console.error("Search fetch error:", error)
  }

  // Mock tags and communities for now as there's no backend for them yet
  const tagResults = [
    { name: "Fantasy", count: 15420 },
    { name: "Adventure", count: 12890 },
    { name: "Magic", count: 9560 },
    { name: "Young Adult", count: 8340 },
  ]

  const communityResults = [
    {
      id: "1",
      name: "Fantasy Writers Guild",
      description: "A community for fantasy writers to share and discuss their work",
      members: 5420,
      posts: 12890,
    },
    {
      id: "2",
      name: "Sci-Fi Enthusiasts",
      description: "Discussing the latest in science fiction literature",
      members: 3890,
      posts: 8560,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Search Header */}
        <section className="border-b border-border bg-gradient-to-b from-accent/20 to-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground">
              {query ? `Results for "${query}"` : "Enter a search query to find books, profiles, tags, and communities"}
            </p>
          </div>
        </section>

        {/* Search Results Tabs */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="books" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
                <TabsTrigger value="books" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Books</span>
                </TabsTrigger>
                <TabsTrigger value="profiles" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profiles</span>
                </TabsTrigger>
                <TabsTrigger value="tags" className="gap-2">
                  <Hash className="h-4 w-4" />
                  <span className="hidden sm:inline">Tags</span>
                </TabsTrigger>
                <TabsTrigger value="communities" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Communities</span>
                </TabsTrigger>
              </TabsList>

              {/* Books Tab */}
              <TabsContent value="books" className="space-y-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">{bookResults.length} books found</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {bookResults.map((book: any) => (
                    <BookCard
                      key={book.id}
                      {...book}
                      cover={getImageUrl(book.coverImage)}
                      author={typeof book.author === 'object' ? book.author?.username : book.author}
                    />
                  ))}
                  {bookResults.length === 0 && query && (
                    <p className="col-span-full text-muted-foreground italic">No books found matching "{query}"</p>
                  )}
                </div>
              </TabsContent>

              {/* Profiles Tab */}
              <TabsContent value="profiles" className="space-y-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">{profileResults.length} profiles found</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {profileResults.map((profile: any) => (
                    <Card key={profile.id}>
                      <CardContent className="p-6">
                        <Link href={`/profile/${profile.username}`} className="block">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={getImageUrl(profile.avatar) || "/placeholder.svg"} />
                              <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1">{profile.name || profile.username}</h3>
                              <p className="text-sm text-muted-foreground mb-2">@{profile.username}</p>
                              {/* Bio and stats mock for now as they might not be in user model yet */}
                            </div>
                          </div>
                        </Link>
                        <div className="absolute top-4 right-4">
                          <ReportModal targetUserId={profile.id} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {profileResults.length === 0 && query && (
                    <p className="col-span-full text-muted-foreground italic">No users found matching "{query}"</p>
                  )}
                </div>
              </TabsContent>

              {/* Tags Tab */}
              <TabsContent value="tags" className="space-y-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">{tagResults.length} tags found</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tagResults.map((tag) => (
                    <Link key={tag.name} href={`/tag/${tag.name.toLowerCase()}`}>
                      <Card className="hover:bg-accent transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Hash className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-lg">{tag.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{tag.count.toLocaleString()} stories</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              {/* Communities Tab */}
              <TabsContent value="communities" className="space-y-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">{communityResults.length} communities found</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {communityResults.map((community) => (
                    <Card key={community.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-2">{community.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{community.description}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>{community.members.toLocaleString()} members</span>
                              <span>{community.posts.toLocaleString()} posts</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section >
      </main >

      <Footer />
    </div >
  )
}

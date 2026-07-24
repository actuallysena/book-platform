import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { fetchAPI, getImageUrl } from "@/lib/api"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let trendingBooks = []
  let recentlyUpdated = []
  let categories = []

  try {
    const [trendingRes, updatedRes, categoriesRes] = await Promise.all([
      fetchAPI('/books?sort=popular'),
      fetchAPI('/books?sort=newest'),
      fetchAPI('/categories')
    ])

    trendingBooks = Array.isArray(trendingRes) ? trendingRes : []
    recentlyUpdated = Array.isArray(updatedRes) ? updatedRes : []
    categories = Array.isArray(categoriesRes) ? categoriesRes : []

  } catch (error) {
    console.error("Failed to fetch data:", error)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-accent/20 to-background">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Where Stories Come Alive
              </h1>
              <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground text-pretty">
                Discover millions of stories from passionate writers around the world. Read, write, and share your
                imagination with our vibrant community.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-4">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Start Reading
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Start Writing
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 sm:py-12 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {categories.map((category: any) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Badge
                    variant="secondary"
                    className={`w-full justify-center py-2.5 sm:py-3 text-sm sm:text-base cursor-pointer transition-colors ${category.color || 'bg-secondary'}`}
                  >
                    {category.name}
                  </Badge>
                </Link>
              ))}
              {categories.length === 0 && (
                <p className="text-muted-foreground italic col-span-full text-center">No categories found. Create some in the backend!</p>
              )}
            </div>
          </div>
        </section>

        {/* Trending Books */}
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Trending Now</h2>
              <Button variant="ghost" className="gap-2 text-sm sm:text-base">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:overflow-visible">
              <div className="flex gap-3 sm:gap-4 min-w-max lg:grid lg:grid-cols-7 lg:min-w-0">
                {trendingBooks.map((book: any) => (
                  <div key={book.id} className="w-32 sm:w-40 lg:w-auto">
                    <BookCard
                      id={book.id}
                      title={book.title}
                      author={book.author?.username || 'Unknown'}
                      cover={getImageUrl(book.coverImage)}
                      likes={book._count?.likes || 0}
                      reads={book.viewCount || 0}
                      comments={book._count?.comments || 0}
                      rating={0}
                      tags={book.category ? [book.category.name] : []}
                    />
                  </div>
                ))}
                {trendingBooks.length === 0 && (
                  <p className="text-muted-foreground italic">No books found. Add some from the backend!</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recently Updated */}
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Recently Updated</h2>
              <Button variant="ghost" className="gap-2 text-sm sm:text-base">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {recentlyUpdated.map((book: any) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author?.username || 'Unknown'}
                  cover={getImageUrl(book.coverImage)}
                  orientation="horizontal"
                  likes={book._count?.likes || 0}
                  reads={book.viewCount || 0}
                  comments={book._count?.comments || 0}
                  rating={0}
                  tags={book.category ? [book.category.name] : []}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

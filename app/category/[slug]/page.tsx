import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookCard } from "@/components/book-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { fetchAPI } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  let category = null

  try {
    category = await fetchAPI(`/categories/slug/${params.slug}`)
  } catch (error) {
    console.error("Failed to fetch category:", error)
    // notFound()
  }

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold">Category Not Found</h1>
          <p className="text-muted-foreground">We couldn't find the category you're looking for.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  // Ensure category.books exists
  const books = category.books || []

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Category Header */}
        <section className={`border-b border-border bg-gradient-to-b ${category.color || 'from-primary/10'} to-background`}>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
            <Link href="/" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </Link>

            <div className="text-center space-y-4">
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {category.name}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">{category.name} Books</h1>
              <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground text-pretty">
                Explore the best stories in {category.name}.
              </p>
            </div>
          </div>
        </section>

        {/* Books Tabs */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="all">All Books</TabsTrigger>
                <TabsTrigger value="new">New Arrivals</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {books.length > 0 ? books.map((book: any) => (
                    <BookCard key={book.id} {...book} />
                  )) : (
                    <p className="col-span-full text-center text-muted-foreground">No books found in this category yet.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="new" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {books.length > 0 ? books.slice(0, 4).map((book: any) => (
                    <BookCard key={book.id} {...book} />
                  )) : (
                    <p className="col-span-full text-center text-muted-foreground">No new books.</p>
                  )}
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

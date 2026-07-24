import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Eye, Star, BookOpen, Share2, Bookmark, Clock, ArrowLeft, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ReportModal } from "@/components/report-modal"
import { getImageUrl } from "@/lib/api"
import { notFound } from "next/navigation"

async function fetchBook(id: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    const res = await fetch(`${API_URL}/books/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await fetchBook(params.id)

  if (!book) {
    notFound()
  }

  // Chapters are included in the book response if findAll uses include, let's check findOne
  // findOne in books.service includes chapters.
  const chapters = book.chapters || []

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Book Header */}
        <section className="border-b border-border bg-gradient-to-b from-accent/20 to-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
            <Link href="/" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </Link>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-[300px_1fr]">
              {/* Book Cover */}
              <div className="mx-auto lg:mx-0">
                <div className="relative aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={getImageUrl(book.coverImage) || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-3 text-balance">
                    {book.title}
                  </h1>
                  <Link
                    href={`/profile/${book.author?.username}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
                  >
                    <Avatar>
                      <AvatarImage src={book.author?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{book.author?.username?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-muted-foreground">Written by</p>
                      <p className="font-semibold">{book.author?.name || book.author?.username}</p>
                    </div>
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{book._count?.likes || 0}</span>
                    <span className="text-muted-foreground">Likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{book.viewCount || 0}</span>
                    <span className="text-muted-foreground">Reads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{book._count?.comments || 0}</span>
                    <span className="text-muted-foreground">Comments</span>
                  </div>
                  {/* Rating logic is not backend yet, so mock or hide */}
                  {/* <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-muted-foreground">(0 ratings)</span>
                  </div> */}
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{chapters.length}</span>
                    <span className="text-muted-foreground">Chapters</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {book.tags?.map((tag: string) => (
                    <Link key={tag} href={`/search?q=${tag.toLowerCase()}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                  <Badge variant="outline" className="border-primary text-primary">
                    {book.status}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{book.description}</p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {chapters.length > 0 ? (
                    <Link href={`/read/${book.id}/${chapters[0].id}`}>
                      <Button size="lg" className="gap-2">
                        <BookOpen className="h-5 w-5" />
                        Start Reading
                      </Button>
                    </Link>
                  ) : (
                    <Button size="lg" disabled className="gap-2">
                      <BookOpen className="h-5 w-5" />
                      No Chapters Yet
                    </Button>
                  )}
                  {/* Other buttons mocked for now */}
                  <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                  <ReportModal targetBookId={book.id} />
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Updated {new Date(book.updatedAt).toLocaleDateString()}
                  </div>
                  {/* <div>Language: English</div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chapters List */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Chapters</h2>
              <p className="text-muted-foreground">{chapters.length} chapters available</p>
            </div>

            <Card>
              <CardContent className="p-0">
                {chapters.length > 0 ? (
                  chapters.map((chapter: any, index: number) => (
                    <div key={chapter.id}>
                      <Link
                        href={`/read/${book.id}/${chapter.id}`}
                        className="flex items-center justify-between p-4 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                            {chapter.order || index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold">{chapter.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(chapter.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </Link>
                      {index < chapters.length - 1 && <Separator />}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    This book has no chapters yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

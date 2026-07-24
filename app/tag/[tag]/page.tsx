"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookCard } from "@/components/book-card"
import { fetchAPI, getImageUrl } from "@/lib/api"
import { Tag } from "lucide-react"

export default function TagPage({ params }: { params: { tag: string } }) {
    const [books, setBooks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const tag = decodeURIComponent(params.tag)

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Fetch books with this tag. Using the search endpoint with tag param.
                // Assuming findAll supports 'tag' query parameter as implemented.
                const data = await fetchAPI(`/books?tag=${encodeURIComponent(tag)}`)
                if (Array.isArray(data)) {
                    setBooks(data)
                }
            } catch (err) {
                console.error("Failed to load tag books", err)
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [tag])

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1">
                <section className="bg-muted/30 border-b">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Tag className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">#{tag}</h1>
                                <p className="text-muted-foreground mt-1">Explore books filed under this tag</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="bg-muted animate-pulse rounded-lg aspect-[2/3]" />
                                        <div className="h-4 bg-muted animate-pulse w-3/4 rounded" />
                                        <div className="h-3 bg-muted animate-pulse w-1/2 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : books.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                                {books.map((book: any) => (
                                    <BookCard
                                        key={book.id}
                                        id={book.id}
                                        title={book.title}
                                        author={book.author?.name || book.author?.username || "Unknown"}
                                        cover={getImageUrl(book.coverImage)}
                                        likes={book._count?.likes || 0}
                                        reads={book.viewCount || 0}
                                        rating={0} // TODO: Implement reading
                                        tags={book.category ? [book.category.name] : []}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-lg text-muted-foreground">No books found for this tag.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

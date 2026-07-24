"use client"

import { useState, useEffect } from "react"
import { getImageUrl } from "@/lib/api"
import { Navbar } from "@/components/navbar"
import { StudioSidebar } from "@/components/studio-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Eye, Heart, MoreVertical, Edit, Trash2, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data - will be replaced with real data later
export default function StudioPage() {
  const [myBooks, setMyBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      fetchBooks(parsedUser.id)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchBooks = async (userId: string) => {
    try {
      // Note: In production, we should wait for the backend restart to have the new endpoint ready.
      // Ideally this endpoint should be protected and get ID from token, but using param for now as implemented.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/books/my-books/${userId}`)
      if (res.ok) {
        const data = await res.json()
        setMyBooks(data)
      }
    } catch (error) {
      console.error("Failed to fetch books:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-xl">Please log in to view your studio.</p>
        <Link href="/login"><Button>Login</Button></Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <StudioSidebar />

        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Books</h1>
                <p className="mt-2 text-muted-foreground">Manage your published and draft stories</p>
              </div>
              <Link href="/studio/new-book">
                <Button className="gap-2">
                  <PlusCircle className="h-5 w-5" />
                  New Book
                </Button>
              </Link>
            </div>

            {/* Books Grid */}
            {myBooks.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myBooks.map((book) => (
                  <Card key={book.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <Image src={getImageUrl(book.coverImage) || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                        <div className="absolute top-3 right-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link href={`/studio/book/${book.id}`}>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Details
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/studio/book/${book.id}/chapter/new`}>
                                <DropdownMenuItem>
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add Chapter
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                      </div>
                      <div className="mb-3">
                        <Badge variant={book.status === "PUBLISHED" ? "default" : "secondary"}>{book.status}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{book._count?.chapters || 0} chapters</p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {book.viewCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {book._count?.likes || 0}
                          </span>
                        </div>
                        <p>Updated {new Date(book.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Link href={`/studio/book/${book.id}`} className="w-full">
                        <Button variant="outline" className="w-full bg-transparent">
                          Manage Book
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="mx-auto max-w-md space-y-4">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No books yet</h3>
                  <p className="text-muted-foreground">Start your writing journey by creating your first book.</p>
                  <Link href="/studio/new-book">
                    <Button className="gap-2">
                      <PlusCircle className="h-5 w-5" />
                      Create Your First Book
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

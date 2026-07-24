"use client"

import React, { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { StudioSidebar } from "@/components/studio-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"



export default function NewBookPage() {
  const router = useRouter()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        const res = await fetch(`${API_URL}/categories`)
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) => (prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]))
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        alert("Please log in to create a book")
        router.push("/login")
        return
      }
      const user = JSON.parse(storedUser)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

      let coverImageUrl = ""

      // 1. Upload Cover Image if exists
      if (coverFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", coverFile)

        try {
          const uploadRes = await fetch(`${API_URL}/uploads`, {
            method: "POST",
            body: uploadFormData,
          })

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json()
            coverImageUrl = uploadData.url
          } else {
            console.error("Upload failed")
          }
        } catch (err) {
          console.error("Upload error", err)
        }
      }

      // Find categoryId for the first selected tag
      const mainCategory = categories.find(c => selectedTags[0] === c.name)

      // 2. Create Book
      const bookData = {
        title: formData.title,
        description: formData.description,
        coverImage: coverImageUrl,
        authorId: user.id,
        imageUrl: coverImageUrl, // Some parts might use this
        categoryId: mainCategory ? mainCategory.id : null,
        tags: selectedTags
      }

      const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // Send token if available
        },
        body: JSON.stringify(bookData)
      })

      if (res.ok) {
        // const newBook = await res.json()
        router.push("/studio") // Redirect to studio dashboard
      } else {
        const errorData = await res.json()
        alert(`Failed to create book: ${errorData.message || "Unknown error"}`)
      }

    } catch (error) {
      console.error("Error creating book:", error)
      alert("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <StudioSidebar />

        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <Link href="/studio">
                <Button variant="ghost" size="sm" className="mb-4 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Studio</span>
                </Button>
              </Link>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create New Book</h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Fill in the details to start your new story
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Book Cover */}
              <Card>
                <CardHeader>
                  <CardTitle>Book Cover</CardTitle>
                  <CardDescription>Upload a cover image for your book (recommended: 800x1200px)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-6">
                    <div className="relative aspect-[2/3] w-48 overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
                      {coverPreview ? (
                        <>
                          <img
                            src={coverPreview}
                            alt="Cover preview"
                            className="h-full w-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => {
                              setCoverPreview(null)
                              setCoverFile(null)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="cover-upload" className="cursor-pointer">
                        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors">
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload cover image</p>
                          </div>
                        </div>
                      </Label>
                      <Input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Book Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Book Details</CardTitle>
                  <CardDescription>Provide basic information about your book</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter your book title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Write a compelling description of your book..."
                      rows={6}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Genres & Tags</Label>
                    <p className="text-sm text-muted-foreground mb-3">Select up to 5 genres that fit your book</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant={selectedTags.includes(category.name) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(category.name)}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">Selected: {selectedTags.length}/5 genres</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="submit" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Book
                </Button>
                <Link href="/studio">
                  <Button type="button" variant="outline" size="lg">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { getImageUrl } from "@/lib/api"
import { Navbar } from "@/components/navbar"
import { StudioSidebar } from "@/components/studio-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, Edit, Trash2, Eye, MoreVertical, Loader2, ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import React from "react"

// Sortable Item Component
function SortableChapterItem({ chapter, unwrappedParams }: { chapter: any, unwrappedParams: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: chapter.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 sm:p-4 bg-background hover:bg-accent/50 transition-colors border-b last:border-0">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div {...attributes} {...listeners} className="cursor-grab touch-none p-2 hover:bg-muted rounded">
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded bg-muted text-xs sm:text-sm font-medium flex-shrink-0">
          {chapter.order}
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-medium truncate">{chapter.title}</h3>
            <Badge variant={chapter.published ? "default" : "secondary"} className="h-5 px-1.5 text-[10px]">
              {chapter.published ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
            Last edited {new Date(chapter.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`/studio/book/${unwrappedParams.id}/chapter/${chapter.id}/edit`}>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Content
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function ManageBookPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const router = useRouter()
  const [book, setBook] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  // Edit State
  const [editForm, setEditForm] = useState({ title: "", description: "", categoryId: "", tags: [] as string[] })
  const [newTag, setNewTag] = useState("")
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const token = localStorage.getItem("token")
        // 1. Fetch Book Details
        const bookRes = await fetch(`${API_URL}/books/${unwrappedParams.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (!bookRes.ok) throw new Error("Failed to fetch book")
        const bookData = await bookRes.json()
        setBook(bookData)
        setEditForm({
          title: bookData.title,
          description: bookData.description || "",
          categoryId: bookData.categoryId || "",
          tags: bookData.tags || []
        })
        setCoverPreview(getImageUrl(bookData.coverImage))

        // 2. Fetch Chapters (including drafts)
        const chaptersRes = await fetch(`${API_URL}/chapters/book/${unwrappedParams.id}?drafts=true`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (chaptersRes.ok) {
          const chaptersData = await chaptersRes.json()
          setChapters(chaptersData)
        }

        // 3. Fetch Categories
        const categoriesRes = await fetch(`${API_URL}/categories`)
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        // router.push("/studio") 
      } finally {
        setLoading(false)
      }
    }

    fetchBookData()
  }, [unwrappedParams.id, API_URL])

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

  const handlePublishStatus = async (newStatus: string) => {
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/books/${unwrappedParams.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        const updatedBook = await res.json()
        setBook(updatedBook)
      } else {
        const error = await res.json()
        alert(`Failed to update status: ${error.message}`)
      }
    } catch (error) {
      console.error("Status update error:", error)
      alert("Error updating status")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateBook = async () => {
    setSaving(true)
    try {
      let coverImageUrl = book.coverImage

      // Upload new cover if selected
      if (coverFile) {
        const formData = new FormData()
        formData.append("file", coverFile)
        const uploadRes = await fetch(`${API_URL}/uploads`, { method: "POST", body: formData })
        if (uploadRes.ok) {
          const data = await uploadRes.json()
          coverImageUrl = data.url
        }
      }

      const res = await fetch(`${API_URL}/books/${unwrappedParams.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          coverImage: coverImageUrl,
          categoryId: editForm.categoryId,
          tags: editForm.tags
        })
      })

      if (res.ok) {
        const updatedBook = await res.json()
        setBook(updatedBook)
        setIsEditing(false)
        setCoverFile(null)
      } else {
        if (res.status === 401) {
          alert("Session expired. Please log in again.")
          router.push("/login")
          return
        }
        const errorData = await res.json()
        alert(`Failed to update book: ${errorData.message || res.statusText}`)
      }
    } catch (error) {
      console.error("Update error:", error)
      alert("An unexpected error occurred while updating the book.")
    } finally {
      setSaving(false)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        // Update order numbers visually immediately
        return newItems.map((item, index) => ({ ...item, order: index + 1 }))
      })

      // Send update to backend
      try {
        const newOrderIds = arrayMove(chapters,
          chapters.findIndex(c => c.id === active.id),
          chapters.findIndex(c => c.id === over.id)
        ).map(c => c.id)

        await fetch(`${API_URL}/chapters/reorder`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ bookId: unwrappedParams.id, chapterIds: newOrderIds })
        })
      } catch (e) {
        console.error("Failed to reorder chapters", e)
      }
    }
  }

  const addTag = () => {
    if (newTag && !editForm.tags.includes(newTag)) {
      setEditForm({ ...editForm, tags: [...editForm.tags, newTag] })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setEditForm({ ...editForm, tags: editForm.tags.filter(t => t !== tag) })
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!book) {
    return <div className="flex h-screen items-center justify-center">Book not found</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <StudioSidebar />

        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <Link href="/studio">
                <Button variant="ghost" size="sm" className="mb-4 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Studio
                </Button>
              </Link>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-6 w-full">
                  <div className="relative aspect-[2/3] w-32 sm:w-40 mx-auto sm:mx-0 overflow-hidden rounded-lg shadow-sm flex-shrink-0">
                    <img src={getImageUrl(book.coverImage) || "/placeholder.svg"} alt={book.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">{book.title}</h1>
                    <div className="mt-2 flex flex-wrap justify-center sm:justify-start items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant={book.status === "PUBLISHED" ? "default" : "secondary"}>{book.status}</Badge>
                      <span>•</span>
                      <span>{chapters.length} chapters</span>
                      <span>•</span>
                      <span>Updated {new Date(book.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-4 text-muted-foreground line-clamp-3 text-center sm:text-left">{book.description}</p>

                    {/* Publish Actions */}
                    <div className="mt-4 flex gap-2 justify-center sm:justify-start">
                      {book.status === "PUBLISHED" ? (
                        <Button variant="outline" size="sm" onClick={() => handlePublishStatus('DRAFT')} disabled={saving}>
                          Unpublish Book
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handlePublishStatus('PUBLISHED')} disabled={saving}>
                          Publish Book
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start mt-4 sm:mt-0">
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
                        <Edit className="h-4 w-4" />
                        Edit Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-[600px] h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Book Details</DialogTitle>
                        <DialogDescription>Make changes to your book here. Click save when you're done.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input
                            id="edit-title"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-desc">Description</Label>
                          <Textarea
                            id="edit-desc"
                            rows={4}
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Category</Label>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                              <Badge
                                key={cat.id}
                                variant={editForm.categoryId === cat.id ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setEditForm({ ...editForm, categoryId: cat.id })}
                              >
                                {cat.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Tags</Label>
                          <div className="flex gap-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add tags..."
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" onClick={addTag} variant="secondary">Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {editForm.tags.map(tag => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                                <button onClick={() => removeTag(tag)} className="ml-2 hover:text-destructive"><X className="h-3 w-3" /></button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Cover Image</Label>
                          <div className="flex items-center gap-4">
                            <div className="relative aspect-[2/3] h-20 w-14 overflow-hidden rounded border">
                              <img src={coverPreview || "/placeholder.svg"} className="h-full w-full object-cover" />
                            </div>
                            <Label htmlFor="edit-cover" className="cursor-pointer">
                              <div className="flex items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm hover:bg-accent">
                                <Upload className="h-4 w-4" />
                                Change Cover
                              </div>
                            </Label>
                            <Input id="edit-cover" type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button disabled={saving} onClick={handleUpdateBook}>
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Link href={`/book/${unwrappedParams.id}`} className="flex-1 sm:flex-none">
                    <Button variant="outline" className="gap-2 w-full">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/studio/book/${unwrappedParams.id}/chapter/new`} className="flex-1 sm:flex-none">
                    <Button className="gap-2 w-full">
                      <PlusCircle className="h-5 w-5" />
                      New Chapter
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Chapters List */}
            <Card>
              <CardHeader>
                <CardTitle>Chapters</CardTitle>
                <CardDescription>Drag to reorder your chapters.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {chapters.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={chapters.map(c => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="divide-y">
                        {chapters.map((chapter) => (
                          <SortableChapterItem key={chapter.id} chapter={chapter} unwrappedParams={unwrappedParams} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground mb-4">No chapters yet.</p>
                    <Link href={`/studio/book/${unwrappedParams.id}/chapter/new`}>
                      <Button variant="outline">Create First Chapter</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

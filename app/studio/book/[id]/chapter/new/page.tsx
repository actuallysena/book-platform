"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { StudioSidebar } from "@/components/studio-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewChapterPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [chapterTitle, setChapterTitle] = useState("")
  const [chapterContent, setChapterContent] = useState<any>(null) // JSON content
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (isPublished: boolean) => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Please log in")
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const res = await fetch(`${API_URL}/chapters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: chapterTitle,
          content: chapterContent, // JSON
          bookId: params.id,
          published: isPublished
        })
      })

      if (res.ok) {
        // const data = await res.json()
        router.push(`/studio/book/${params.id}`)
      } else {
        const err = await res.json()
        alert(`Failed to save: ${err.message}`)
      }
    } catch (error) {
      console.error("Error saving chapter:", error)
      alert("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }


  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <StudioSidebar />

        <main className="flex-1 lg:pl-64">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:py-8 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-4 mb-4">
                <Link href={`/studio/book/${params.id}`}>
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Chapter</h1>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    Write and publish a new chapter for your book
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2 bg-transparent text-sm" disabled={isSaving}>
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent text-sm"
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button className="gap-2 text-sm" onClick={() => handleSave(true)} disabled={isSaving || !chapterTitle.trim()}>
                  Publish Chapter
                </Button>
              </div>
            </div>

            {/* Editor */}
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="chapter-title">Chapter Title *</Label>
                <Input
                  id="chapter-title"
                  placeholder="Enter chapter title"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chapter-content">Chapter Content *</Label>
                <div className="min-h-[400px] sm:min-h-[600px] rounded-lg border bg-background">
                  <RichTextEditor
                    value={chapterContent}
                    onChange={setChapterContent}
                    placeholder="Start writing your chapter..."
                    className="min-h-[400px] sm:min-h-[600px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { StudioSidebar } from "@/components/studio-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import React from "react"

export default function EditChapterPage({ params }: { params: Promise<{ id: string; chapterId: string }> }) {
  const unwrappedParams = React.use(params)
  const router = useRouter()

  // State
  const [chapterTitle, setChapterTitle] = useState("")
  const [chapterContent, setChapterContent] = useState<any>(null)
  const [chapterStatus, setChapterStatus] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const isFirstRun = useRef(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

  // Load Chapter
  useEffect(() => {
    const loadChapter = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await fetch(`${API_URL}/chapters/${unwrappedParams.chapterId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })

        if (res.ok) {
          const data = await res.json()
          console.log("Loaded chapter:", data)
          setChapterTitle(data.title)
          setChapterContent(data.content || {})
          setChapterStatus(data.published ? "Published" : "Draft")
        } else {
          console.error("Failed to load chapter")
        }
      } catch (error) {
        console.error("Error loading chapter:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChapter()
  }, [unwrappedParams.chapterId, API_URL])

  // Save Function
  const handleSave = async (silent = false) => {
    if (!silent) setIsSaving(true)
    else setIsAutoSaving(true)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/chapters/${unwrappedParams.chapterId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: chapterTitle,
          content: chapterContent
        })
      })

      if (!res.ok) {
        const error = await res.json()
        if (!silent) alert(`Failed to save: ${error.message || res.statusText}`)
        console.error("Auto-save failed", error)
      } else {
        setLastSaved(new Date())
      }
    } catch (e) {
      console.error(e)
      if (!silent) alert("Error saving chapter")
    } finally {
      setIsSaving(false)
      setIsAutoSaving(false)
    }
  }

  // Preview Function (Save + Navigate)
  const handlePreview = async () => {
    await handleSave(true)
    router.push(`/read/${unwrappedParams.id}/${unwrappedParams.chapterId}`)
  }

  // Publish Function
  const handlePublish = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/chapters/${unwrappedParams.chapterId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: chapterTitle,
          content: chapterContent,
          published: true
        })
      })

      if (res.ok) {
        router.push(`/studio/book/${unwrappedParams.id}`)
      } else {
        const error = await res.json()
        alert(`Failed to publish: ${error.message || res.statusText}`)
      }
    } catch (e) {
      console.error(e)
      alert("Error publishing chapter")
    } finally {
      setIsSaving(false)
    }
  }

  // Delete Function
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/chapters/${unwrappedParams.chapterId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (res.ok) {
        router.push(`/studio/book/${unwrappedParams.id}`)
      } else {
        alert("Failed to delete")
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Auto-save Effect
  useEffect(() => {
    if (isLoading) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timer = setTimeout(() => {
      handleSave(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [chapterTitle, chapterContent]) // Dependencies for auto-save

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar variant="studio" />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading chapter...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar variant="studio">
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground mr-2 hidden sm:block">
            {isAutoSaving ? "Saving..." : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Unsaved"}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="h-8 w-8 px-0 sm:w-auto sm:px-3"
            title="Save"
          >
            <Save className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{isSaving ? "Saving" : "Save"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
            disabled={isSaving}
            className="h-8 w-8 px-0 sm:w-auto sm:px-3"
            title="Preview"
          >
            <Eye className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isSaving || !chapterTitle.trim() || chapterStatus === "Published"}
            className="h-8 px-3 text-xs sm:text-sm"
            variant={chapterStatus === "Published" ? "secondary" : "default"}
          >
            {chapterStatus === "Published" ? "Published" : "Publish"}
          </Button>
        </div>
      </Navbar>

      <div className="flex flex-1 relative">
        <StudioSidebar />

        <main className="flex-1 lg:pl-64 pb-20">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Link href={`/studio/book/${unwrappedParams.id}`}>
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold tracking-tight">Edit Chapter</h1>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="chapter-title"
                  placeholder="Chapter Title"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="text-3xl font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 h-auto rounded-none"
                />
              </div>

              <div className="min-h-[600px] rounded-lg">
                <RichTextEditor
                  key={unwrappedParams.chapterId}
                  value={chapterContent}
                  onChange={setChapterContent}
                  placeholder="Tell your story..."
                  className="min-h-[600px] border-0 focus:ring-0 px-0"
                />
              </div>
            </div>
          </div>
        </main>
      </div>



      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chapter?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chapter? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Chapter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

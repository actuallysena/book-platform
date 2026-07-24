"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bookmark, Highlighter, X, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookmarkData {
  id: string
  name: string
  position: number
  timestamp: string
}

interface HighlightData {
  id: string
  text: string
  color: string
  paragraphIndex: number
  chapterId: string
  timestamp: string
}

interface ReadingProgressProps {
  progress: number
  estimatedMinutes: number
  bookId: string
  chapterId: string
  onBookmarkClick: (position: number) => void
  onHighlightClick: () => void
  isVisible: boolean
  isLiked: boolean
  onLikeToggle: () => void
}

export function ReadingProgress({
  progress,
  estimatedMinutes,
  bookId,
  chapterId,
  onBookmarkClick,
  onHighlightClick,
  isVisible,
  isLiked,
  onLikeToggle,
}: ReadingProgressProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([])
  const [highlights, setHighlights] = useState<HighlightData[]>([])
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false)
  const [showHighlightsDialog, setShowHighlightsDialog] = useState(false)
  const [bookmarkName, setBookmarkName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#fef08a")

  const colors = [
    { name: "Yellow", value: "#fef08a" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Pink", value: "#fbcfe8" },
    { name: "Orange", value: "#fed7aa" },
  ]

  const handleAddBookmark = () => {
    if (bookmarkName.trim()) {
      const newBookmark: BookmarkData = {
        id: Date.now().toString(),
        name: bookmarkName,
        position: progress,
        timestamp: new Date().toLocaleString(),
      }
      setBookmarks([...bookmarks, newBookmark])
      setBookmarkName("")
      setShowBookmarkDialog(false)
    }
  }

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id))
  }

  const handleRemoveHighlight = (id: string) => {
    setHighlights(highlights.filter((h) => h.id !== id))
  }

  const handleCreateHighlight = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) {
      const selectedText = selection.toString()
      const newHighlight: HighlightData = {
        id: Date.now().toString(),
        text: selectedText,
        color: selectedColor,
        paragraphIndex: 0, // This should be determined from the selection
        chapterId: chapterId,
        timestamp: new Date().toLocaleString(),
      }
      setHighlights([...highlights, newHighlight])

      // Apply highlight to selected text
      const range = selection.getRangeAt(0)
      const span = document.createElement("span")
      span.style.backgroundColor = selectedColor
      span.style.padding = "2px 0"
      span.style.borderRadius = "2px"
      range.surroundContents(span)

      selection.removeAllRanges()
    }
  }

  return (
    <>
      {/* Progress Bar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t transition-all duration-300",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        )}
      >
        <div className="mx-auto max-w-4xl px-4 py-2">
          <div className="flex items-center gap-3">
            <Button
              variant={isLiked ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onLikeToggle}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            </Button>

            <div className="flex-1 space-y-1">
              <div className="relative h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
                {/* Bookmarks on progress bar */}
                {bookmarks.map((bookmark) => (
                  <button
                    key={bookmark.id}
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 hover:w-1 transition-all cursor-pointer"
                    style={{ left: `${bookmark.position}%` }}
                    onClick={() => onBookmarkClick(bookmark.position)}
                    title={bookmark.name}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{progress.toFixed(0)}%</span>
                <span>{estimatedMinutes} min</span>
              </div>
            </div>

            {/* Bookmark Button */}
            <Dialog open={showBookmarkDialog} onOpenChange={setShowBookmarkDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Bookmark</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bookmark-name">Bookmark Name</Label>
                    <Input
                      id="bookmark-name"
                      placeholder="e.g., Important scene"
                      value={bookmarkName}
                      onChange={(e) => setBookmarkName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddBookmark()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Bookmarks</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {bookmarks.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No bookmarks yet</p>
                      ) : (
                        bookmarks.map((bookmark) => (
                          <div key={bookmark.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{bookmark.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {bookmark.position.toFixed(0)}% • {bookmark.timestamp}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveBookmark(bookmark.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <Button onClick={handleAddBookmark} className="w-full">
                    Add Bookmark
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showHighlightsDialog} onOpenChange={setShowHighlightsDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onHighlightClick}>
                  <Highlighter className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Your Highlights</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Highlight Color</Label>
                    <div className="flex gap-2 mt-2">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            selectedColor === color.value ? "border-primary scale-110" : "border-transparent",
                          )}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setSelectedColor(color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <Button onClick={handleCreateHighlight} className="w-full mt-3" size="sm">
                      Highlight Selected Text
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {highlights.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No highlights yet. Select text in the chapter and click "Highlight Selected Text".
                      </p>
                    ) : (
                      highlights.map((highlight) => (
                        <div key={highlight.id} className="p-3 rounded-lg border space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className="text-sm flex-1 px-2 py-1 rounded"
                              style={{ backgroundColor: highlight.color }}
                            >
                              "{highlight.text}"
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveHighlight(highlight.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Chapter {highlight.chapterId} • Paragraph {highlight.paragraphIndex + 1} •{" "}
                            {highlight.timestamp}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  )
}

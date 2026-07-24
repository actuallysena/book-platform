"use client"

import { Button } from "@/components/ui/button"
import { Eye, Save, Send } from "lucide-react"

interface EditorActionBarProps {
    isSaving: boolean
    isAutoSaving: boolean
    lastSaved: Date | null
    chapterStatus: string
    onSave: () => void
    onPreview: () => void
    onPublish: () => void
    canPublish: boolean
}

export function EditorActionBar({
    isSaving,
    isAutoSaving,
    lastSaved,
    chapterStatus,
    onSave,
    onPreview,
    onPublish,
    canPublish,
}: EditorActionBarProps) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-full border bg-background/80 backdrop-blur-sm shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="px-4 text-xs text-muted-foreground border-r mr-2 hidden sm:block">
                {isAutoSaving ? "Saving..." : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Unsaved"}
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-full"
                onClick={onSave}
                disabled={isSaving}
            >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-full"
                onClick={onPreview}
                disabled={isSaving}
            >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
            </Button>

            {chapterStatus === "Draft" && (
                <Button
                    size="sm"
                    className="gap-2 rounded-full pl-4 pr-6 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={onPublish}
                    disabled={isSaving || !canPublish}
                >
                    <Send className="h-3 w-3" />
                    Publish
                </Button>
            )}
        </div>
    )
}

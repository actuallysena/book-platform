"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { CommentableParagraph } from "@/components/commentable-paragraph"

interface ReadOnlyEditorProps {
    value?: any // JSON content
    className?: string
}

export function ReadOnlyEditor({
    value,
    className,
}: ReadOnlyEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: false,
            }),
            CommentableParagraph,
        ],
        content: value,
        editable: false, // Read-only mode
        editorProps: {
            attributes: {
                class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none",
            },
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        if (editor && value) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    if (!editor) {
        return null
    }

    return (
        <div className={cn("bg-transparent", className)}>
            <EditorContent editor={editor} />
        </div>
    )
}

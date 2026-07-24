"use client"

import { createContext, useContext, useState } from "react"

export interface Comment {
    id: string
    userId: string
    username: string
    avatar: string
    content: string
    timestamp: string
    replies: Comment[]
}

interface CommentContextType {
    comments: Record<number, Comment[]>
    addComment: (paragraphIndex: number, content: string, parentId?: string) => void
    deleteComment: (commentId: string) => void
    updateComment: (commentId: string, content: string) => void
    highlightedCommentId?: string | null
    currentUserId?: string | null
    currentUserRole?: string | null
    bookAuthorId?: string | null
}

const CommentContext = createContext<CommentContextType | null>(null)

export function useCommentContext() {
    const context = useContext(CommentContext)
    if (!context) {
        throw new Error("useCommentContext must be used within a CommentProvider")
    }
    return context
}

export function CommentProvider({
    children,
    comments = {},
    onAddComment,
    onDeleteComment,
    onUpdateComment,
    highlightedCommentId,
    currentUserId,
    currentUserRole,
    bookAuthorId
}: {
    children: React.ReactNode,
    comments?: Record<number, Comment[]>,
    onAddComment?: (index: number, content: string, parentId?: string) => void
    onDeleteComment?: (commentId: string) => void
    onUpdateComment?: (commentId: string, content: string) => void
    highlightedCommentId?: string | null
    currentUserId?: string | null
    currentUserRole?: string | null
    bookAuthorId?: string | null
}) {
    const addComment = (index: number, content: string, parentId?: string) => {
        if (onAddComment) {
            onAddComment(index, content, parentId)
        }
    }

    const deleteComment = (commentId: string) => {
        if (onDeleteComment) onDeleteComment(commentId)
    }

    const updateComment = (commentId: string, content: string) => {
        if (onUpdateComment) onUpdateComment(commentId, content)
    }

    return (
        <CommentContext.Provider value={{
            comments,
            addComment,
            deleteComment,
            updateComment,
            highlightedCommentId,
            currentUserId,
            currentUserRole,
            bookAuthorId
        }}>
            {children}
        </CommentContext.Provider>
    )
}

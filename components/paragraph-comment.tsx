"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Reply, Send, X, MoreVertical, Pencil, Trash, Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCommentContext } from "@/components/comment-context"
import { ReportModal } from "@/components/report-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  timestamp: string
  replies: Comment[]
}

interface ParagraphCommentProps {
  paragraphIndex: number
  comments: Comment[]
  onAddComment: (paragraphIndex: number, content: string, parentId?: string) => void
}

export function ParagraphComment({ paragraphIndex, comments, onAddComment }: ParagraphCommentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [replyingToUsername, setReplyingToUsername] = useState<string>("")

  const { highlightedCommentId, deleteComment, updateComment, currentUserId, currentUserRole, bookAuthorId } = useCommentContext();
  const commentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (highlightedCommentId) {
      // Check if this paragraph contains the highlighted comment
      const hasHighlighted = comments.some(c => c.id === highlightedCommentId || hasReply(c, highlightedCommentId));
      if (hasHighlighted) {
        setIsOpen(true);
        setTimeout(() => {
          const el = commentRefs.current[highlightedCommentId];
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Optional: shake animation or flash
          }
        }, 300);
      }
    }
  }, [highlightedCommentId, comments]);

  const hasReply = (c: Comment, id: string): boolean => {
    if (c.id === id) return true;
    return c.replies.some(r => hasReply(r, id));
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(paragraphIndex, newComment)
      setNewComment("")
    }
  }

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment(paragraphIndex, replyContent, parentId)
      setReplyContent("")
      setReplyingTo(null)
      setReplyingToUsername("")
    }
  }

  const handleReplyClick = (commentId: string, username: string) => {
    setReplyingTo(commentId)
    setReplyingToUsername(username)
    setReplyContent(`@${username} `)
  }

  // Recursive component for comments
  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    // Default to expanded if 1 or fewer replies, otherwise collapsed
    const [isExpanded, setIsExpanded] = useState(comment.replies && comment.replies.length <= 1);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isHighlighted = comment.id === highlightedCommentId;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    return (
      <div
        ref={(el) => { if (el) commentRefs.current[comment.id] = el; }}
        className={cn("space-y-2 transition-colors duration-500 rounded-md p-1", depth > 0 && "ml-3 pl-3 border-l-2 border-muted", isHighlighted && "bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/20 shadow-sm")}
      >
        <div className="flex gap-3 items-start group/item relative">
          <Link href={`/profile/${comment.username}`} className="shrink-0">
            <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.username} />
              <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/profile/${comment.username}`}
                className="font-semibold text-sm hover:underline hover:text-primary transition-colors"
              >
                {comment.username}
              </Link>
              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
            </div>

            {/* Actions Menu */}
            <div className="absolute top-0 right-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {currentUserId === comment.userId && (
                    <DropdownMenuItem onClick={() => {
                      setEditContent(comment.content);
                      setIsEditing(true);
                    }}>
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                    </DropdownMenuItem>
                  )}
                  {/* Delete: Owner OR Admin OR Book Author */}
                  {(currentUserId === comment.userId ||
                    currentUserId === bookAuthorId ||
                    (currentUserRole === 'ADMIN' || currentUserRole === 'MODERATOR')
                  ) && (
                      <DropdownMenuItem onClick={() => deleteComment(comment.id)} className="text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    )}
                  <ReportModal
                    targetCommentId={comment.id}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Flag className="mr-2 h-3.5 w-3.5" /> Report
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {!isEditing ? (
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {comment.content.split(/(@\w+)/g).map((part, i) => {
                  if (part.startsWith('@')) {
                    const username = part.substring(1);
                    return (
                      <Link
                        key={i}
                        href={`/profile/${username}`} // Assuming profile lookup by username is supported or we need ID.
                        // Ideally we need userId, but regex only gives username. 
                        // If backend stores mentions, we could use that.
                        // For now, let's assume /profile/username works or just link to search?
                        // Wait, profile routes usually use ID.
                        // Let's use a search or just style it for now if we can't resolve ID easily.
                        // Actually, fetching user by username might be needed.
                        // Let's assume the route /u/username exists or we make it safe.
                        // OR just making it look like a link if we can't guarantee target.
                        // But the user asked for "clickable".
                        // best effort: Link to /profile?username=... or similar if ID unknown.
                        // Existing code uses /profile/${comment.userId} for the avatar.
                        // Getting ID from just text is hard without metadata.
                        // Let's just style it blue for now and maybe Link to a search page?
                        // Or if we assume usernames are unique, maybe /u/[username].
                        className="text-primary hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                      </Link>
                    );
                  }
                  return part;
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[60px] text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button size="sm" onClick={() => {
                    updateComment(comment.id, editContent);
                    setIsEditing(false);
                  }}>Save</Button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1.5 text-xs text-muted-foreground hover:text-primary px-0"
                onClick={() => handleReplyClick(comment.id, comment.username)}
              >
                <Reply className="h-3 w-3" />
                Reply
              </Button>

              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 text-xs text-muted-foreground px-0 hover:bg-transparent"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <span className="flex items-center gap-1">Collapse</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Show {comment.replies.length} replies
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form (if Replying to this specific comment) */}
        {replyingTo === comment.id && (
          <div className="ml-8 mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-between bg-muted/30 p-2 rounded text-xs text-muted-foreground mb-1">
              <span>Replying to @{replyingToUsername}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => {
                setReplyingTo(null);
                setReplyingToUsername("");
                setReplyContent("");
              }}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              placeholder={`Write a reply...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[80px] resize-none text-sm text-left"
              autoFocus
              onFocus={(e) => {
                const val = e.target.value;
                e.target.setSelectionRange(val.length, val.length);
              }}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={() => handleSubmitReply(comment.id)} className="gap-1 h-8">
                <Send className="h-3 w-3" />
                Reply
              </Button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {hasReplies && isExpanded && (
          <div className="space-y-3 pt-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Comment Indicator Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "absolute -right-12 top-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all",
          "opacity-0 group-hover:opacity-100",
          (isOpen || comments.length > 0) && "opacity-100",
          comments.length > 0
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground hover:bg-muted/80",
        )}
      >
        <MessageCircle className="h-3 w-3" />
        <span>{comments.length}</span>
      </button>

      {/* Comments Panel */}
      {isOpen && (
        <>
          {/* Overlay - visible on all devices to handle click-outside/closure */}
          <div
            className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={cn(
              "fixed inset-y-0 right-0 z-50 w-full md:w-[400px] flex flex-col bg-background border-l shadow-2xl animate-in slide-in-from-right duration-300",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <h3 className="font-semibold text-sm">
                  {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
                </h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
              )}
            </div>

            {/* New Comment Form */}
            <div className="p-3 border-t bg-background pb-24 sm:pb-4 z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex gap-2 items-end">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[40px] max-h-[120px] resize-none py-2"
                  rows={1}
                />
                <Button
                  onClick={handleSubmitComment}
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  disabled={!newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

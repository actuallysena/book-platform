"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ReaderControls } from "@/components/reader-controls"
import { ReadingProgress } from "@/components/reading-progress"
import { ReadOnlyEditor } from "@/components/read-only-editor"
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CommentProvider } from "@/components/comment-context"
import { getImageUrl } from "@/lib/api"
import { useSearchParams } from "next/navigation"

// Comment interface
interface Comment {
    id: string
    userId: string
    username: string
    avatar: string
    content: string
    timestamp: string
    createdAt: string // Raw ISO date for sorting
    replies: Comment[]
}

interface ReaderClientProps {
    bookId: string
    chapterId: string
    bookTitle: string
    chapterTitle: string
    content: any // JSON
    previousChapterId?: string
    nextChapterId?: string
    chapters: { id: string; title: string; order: number }[]
    bookAuthorId?: string
}

export function ReaderClient({
    bookId,
    chapterId,
    bookTitle,
    chapterTitle,
    content,
    previousChapterId,
    nextChapterId,
    chapters,
    bookAuthorId
}: ReaderClientProps) {
    const router = useRouter()
    const [fontSize, setFontSize] = useState(18)
    const [lineHeight, setLineHeight] = useState(1.8)
    const [theme, setTheme] = useState<"light" | "dark" | "sepia">("light")
    const [isLiked, setIsLiked] = useState(false)
    const [showChapterList, setShowChapterList] = useState(false)
    const [paragraphComments, setParagraphComments] = useState<Record<number, Comment[]>>({})
    const [scrollProgress, setScrollProgress] = useState(0)
    const [estimatedMinutes, setEstimatedMinutes] = useState(5)
    const [showProgress, setShowProgress] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const contentRef = useRef<HTMLDivElement>(null)

    const searchParams = useSearchParams()
    const highlightedCommentId = searchParams.get('highlight')

    const [hasViewed, setHasViewed] = useState(false)
    const startTime = useRef(Date.now())
    const [isLikLoading, setIsLikLoading] = useState(false)

    // Fetch initial like status
    useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/books/${bookId}/like-status`, {
                    headers: { "Authorization": `Bearer ${token}` },
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    setIsLiked(data.liked);
                }
            } catch (e) {
                // Ignore
            }
        }
        checkLikeStatus();
    }, [bookId]);

    const handleLikeToggle = async () => {
        if (isLikLoading) return;

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        setIsLikLoading(true);
        // Optimistic update
        const prev = isLiked;
        setIsLiked(!prev);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/books/${bookId}/like`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                // Revert
                setIsLiked(prev);
            }
        } catch (e) {
            setIsLiked(prev);
        } finally {
            setIsLikLoading(false);
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return
            const windowHeight = window.innerHeight
            const documentHeight = contentRef.current.scrollHeight
            const scrollTop = window.scrollY
            const scrollableHeight = documentHeight - windowHeight
            const progress = (scrollTop / scrollableHeight) * 100
            setScrollProgress(Math.min(100, Math.max(0, progress)))

            // Smart View Counting Logic
            const timeSpent = Date.now() - startTime.current;
            const minTime = Math.max(10000, (estimatedMinutes * 60 * 1000) / 4); // 1/4th of estimated time

            if (!hasViewed && progress > 90 && timeSpent > minTime) {
                setHasViewed(true); // set first to prevent double trigger
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/books/${bookId}/view`, { method: 'POST' }).catch(console.error);
                console.log("View registered!");
            }

            if (scrollTop > lastScrollY && scrollTop > 100) {
                setShowProgress(true)
            }
            setLastScrollY(scrollTop)
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [lastScrollY])

    useEffect(() => {
        if (showProgress) {
            const timer = setTimeout(() => setShowProgress(false), 2000)
            return () => clearTimeout(timer)
        }
    }, [showProgress, lastScrollY])

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/interactions/chapters/${chapterId}/comments`, {
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log("Fetched comments:", data); // Debug log

                    // Group by blockId (pos)
                    // Group by blockId (pos) and build tree
                    const grouped: Record<number, Comment[]> = {};
                    const commentMap = new Map<string, any>();
                    const rootComments: any[] = [];

                    // First pass: Create map and separate roots from replies, but keep raw structure
                    data.forEach((c: any) => {
                        const formatted = {
                            id: c.id,
                            userId: c.userId,
                            username: c.user?.username || "User",
                            avatar: getImageUrl(c.user?.avatar) || "/placeholder.svg",
                            content: c.content,
                            timestamp: new Date(c.createdAt).toLocaleDateString(),
                            createdAt: c.createdAt,
                            parentId: c.parentId,
                            blockId: c.blockId,
                            replies: []
                        };
                        commentMap.set(c.id, formatted);
                    });

                    // Second pass: Associate replies to parents
                    data.forEach((c: any) => {
                        const comment = commentMap.get(c.id);
                        if (c.parentId && commentMap.has(c.parentId)) {
                            commentMap.get(c.parentId).replies.push(comment);
                            // Sort replies by old to new usually, or new to old? Replies usually old to new. 
                            // But createAt desc from backend means newest first. Let's keep newest first for now or reverse.
                            // Standard thread: Newest at bottom? No, newest at top usually for social, but linear time for forums. 
                            // Let's stick to backend order (Desc) for now.
                        } else {
                            // It's a root comment (or parent not found)
                            if (c.blockId) {
                                const pos = parseInt(c.blockId);
                                if (!grouped[pos]) grouped[pos] = [];
                                grouped[pos].push(comment);
                            }
                        }
                    });

                    setParagraphComments(grouped);
                }
            } catch (e) {
                console.error("Failed to fetch comments", e);
            }
        };
        fetchComments();
    }, [chapterId]);

    const [currentUser, setCurrentUser] = useState<any>(null)

    // Fetch current user
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/profile`, {
                    headers: { "Authorization": `Bearer ${token}` },
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    setCurrentUser(data);
                }
            } catch (e) {
                console.error("Failed to fetch user", e);
            }
        }
        fetchUser();
    }, []);

    const handleAddComment = async (paragraphIndex: number, content: string, parentId?: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        // Optimistic update
        const tempId = Date.now().toString();
        const newComment: Comment = {
            id: tempId,
            userId: currentUser?.id || "me",
            username: currentUser?.username || "You",
            avatar: getImageUrl(currentUser?.avatar) || "/placeholder.svg?height=32&width=32",
            content,
            timestamp: "Just now",
            createdAt: new Date().toISOString(),
            replies: [],
        }

        // We update local state optimistically
        setParagraphComments((prev) => {
            const updated = { ...prev };
            if (!updated[paragraphIndex]) updated[paragraphIndex] = [];

            if (parentId) {
                // Find parent and add reply
                const findAndAddReply = (comments: Comment[]): boolean => {
                    for (const comment of comments) {
                        if (comment.id === parentId) {
                            comment.replies = [newComment, ...comment.replies];
                            return true;
                        }
                        if (comment.replies.length > 0) {
                            if (findAndAddReply(comment.replies)) return true;
                        }
                    }
                    return false;
                };

                // Clone the array deep enough or just mutate for optimistic (React strict mode might complain if mutation deep)
                // Simplified deep update:
                const deepUpdate = (list: Comment[]): Comment[] => {
                    return list.map(c => {
                        if (c.id === parentId) {
                            return { ...c, replies: [newComment, ...c.replies] };
                        }
                        if (c.replies.length > 0) {
                            return { ...c, replies: deepUpdate(c.replies) };
                        }
                        return c;
                    });
                };
                updated[paragraphIndex] = deepUpdate(updated[paragraphIndex]);

            } else {
                updated[paragraphIndex] = [newComment, ...updated[paragraphIndex]];
            }
            return updated;
        });

        // API Call
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/interactions/books/${bookId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    content,
                    chapterId,
                    blockId: paragraphIndex.toString(),
                    parentId
                })
            });

            if (res.ok) {
                // Success
            }
        } catch (e) {
            console.error("Failed to post comment", e);
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Optimistic update
        setParagraphComments((prev) => {
            const updated = { ...prev };

            // Helper to recursively delete
            const deleteRecursively = (list: Comment[]): Comment[] => {
                return list.filter(c => c.id !== commentId).map(c => ({
                    ...c,
                    replies: deleteRecursively(c.replies)
                }));
            };

            Object.keys(updated).forEach((key) => {
                const k = parseInt(key);
                updated[k] = deleteRecursively(updated[k]);
            });

            return updated;
        });

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/interactions/comments/${commentId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
        } catch (e) {
            console.error("Failed to delete comment", e);
        }
    }

    const handleUpdateComment = async (commentId: string, content: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Optimistic update
        setParagraphComments((prev) => {
            const updated = { ...prev };

            // Helper to recursively update
            const updateRecursively = (list: Comment[]): Comment[] => {
                return list.map(c => {
                    if (c.id === commentId) {
                        return { ...c, content };
                    }
                    return { ...c, replies: updateRecursively(c.replies) };
                });
            };

            Object.keys(updated).forEach((key) => {
                const k = parseInt(key);
                updated[k] = updateRecursively(updated[k]);
            });

            return updated;
        });

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/interactions/comments/${commentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });
        } catch (e) {
            console.error("Failed to update comment", e);
        }
    }

    const handleBookmarkClick = (position: number) => {
        if (contentRef.current) {
            const scrollHeight = contentRef.current.scrollHeight - window.innerHeight
            window.scrollTo({ top: (scrollHeight * position) / 100, behavior: "smooth" })
        }
    }

    const handleHighlightClick = () => { }

    const themeClasses = {
        light: "bg-white text-gray-900",
        dark: "bg-gray-900 text-gray-100",
        sepia: "bg-[#f4ecd8] text-[#5c4a3a]",
    }

    return (
        <div className={cn("min-h-screen transition-colors", themeClasses[theme])}>
            {/* Header */}
            <header className="sticky top-0 z-30 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-4xl px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href={`/book/${bookId}`}>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Back to Book
                            </Button>
                        </Link>

                        <div className="flex items-center gap-2">
                            <ReaderControls
                                fontSize={fontSize}
                                lineHeight={lineHeight}
                                theme={theme}
                                onFontSizeChange={setFontSize}
                                onLineHeightChange={setLineHeight}
                                onThemeChange={setTheme}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowChapterList(!showChapterList)}
                                className="bg-background"
                            >
                                {showChapterList ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <ReadingProgress
                progress={scrollProgress}
                estimatedMinutes={estimatedMinutes}
                bookId={bookId}
                chapterId={chapterId}
                onBookmarkClick={handleBookmarkClick}
                onHighlightClick={handleHighlightClick}
                isVisible={showProgress}
                isLiked={isLiked}
                onLikeToggle={handleLikeToggle}
            />

            {/* Chapter List Sidebar */}
            {showChapterList && (
                <>
                    <div className="fixed inset-0 z-20 bg-black/50" onClick={() => setShowChapterList(false)} />
                    <div className="fixed right-0 top-0 z-30 h-full w-80 bg-background border-l shadow-xl overflow-y-auto">
                        <div className="p-6">
                            <h3 className="font-bold text-lg mb-4">Chapters</h3>
                            <div className="space-y-2">
                                {chapters.map((chapter) => (
                                    <Link
                                        key={chapter.id}
                                        href={`/read/${bookId}/${chapter.id}`}
                                        className={cn(
                                            "block p-3 rounded-lg hover:bg-accent transition-colors",
                                            chapter.id === chapterId && "bg-primary text-primary-foreground",
                                        )}
                                    >
                                        {chapter.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Reading Area */}
            <main ref={contentRef} className="mx-auto max-w-4xl px-4 py-12 pr-20">
                <article className="space-y-8">
                    {/* Chapter Header */}
                    <header className="space-y-2 text-center">
                        <p className="text-sm text-muted-foreground">{bookTitle}</p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {chapterTitle}
                        </h1>
                    </header>

                    {/* Chapter Content */}
                    <div
                        className="prose prose-lg max-w-none font-serif ql-editor"
                        style={{
                            fontSize: `${fontSize}px`,
                            lineHeight: lineHeight,
                        }}
                    >
                        {/* Use ReadOnlyEditor for Tiptap JSON content */}
                        <CommentProvider
                            comments={paragraphComments}
                            onAddComment={handleAddComment}
                            onDeleteComment={handleDeleteComment}
                            onUpdateComment={handleUpdateComment}
                            highlightedCommentId={highlightedCommentId}
                            currentUserId={currentUser?.id}
                            currentUserRole={currentUser?.role}
                            bookAuthorId={bookAuthorId}
                        >
                            <ReadOnlyEditor value={content} />
                        </CommentProvider>
                    </div>

                    {/* Chapter Navigation */}
                    <div className="flex items-center justify-between pt-8 border-t">
                        {previousChapterId ? (
                            <Link href={`/read/${bookId}/${previousChapterId}`}>
                                <Button variant="outline" className="gap-2 bg-transparent">
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous Chapter
                                </Button>
                            </Link>
                        ) : (
                            <div />
                        )}

                        {nextChapterId && (
                            <Link href={`/read/${bookId}/${nextChapterId}`}>
                                <Button className="gap-2">
                                    Next Chapter
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </article>
            </main>
        </div>
    )
}

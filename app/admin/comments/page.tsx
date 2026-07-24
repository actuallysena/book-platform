
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CommentsPage() {
    const router = useRouter()
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState("")

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")

        if (!storedUser || !storedToken) {
            router.push("/login")
            return
        }
        setToken(storedToken)

        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.role !== "ADMIN" && parsedUser.role !== "MODERATOR") {
            router.push("/")
            return
        }

        // Fetch recent comments (using existing endpoint or needing a new one?)
        // Currently we don't have GET /comments/all. 
        // We might need to iterate or just show a placeholder if backend is missing.
        // For now, let's try to fetch from a hypothetical endpoint or just show empty state.
        // Wait, current task didn't specify creating GET /comments/all backend endpoint. 
        // I will assume for now we might mock it or realizing we need it. 
        // Let's create the page assuming we will fetch from /interactions/comments/recent if I create it,
        // OR just generic /interactions/comments if supported.
        // Actually, let's look at `InteractionsController`. usage.
        // It has `getComments(bookId)`. Not `getAllComments`.
        // I will proceed creating the Page layout, but fetch will likely fail or need backend work.
        // I'll stick to a placeholder "Comments Feed" for now.

        // BETTER PLAN: Fetch a few books and their comments? No, inefficient.
        // I'll mark this as "Under Construction" or "Recent Comments" if I add the endpoint.
        // Since I'm an agent, I can add the endpoint quickly! 
        // I'll add GET /interactions/global-comments to backend in a bit.

        // For now, write the frontend assuming the endpoint exists.
        fetch("http://localhost:3001/interactions/global-comments", {
            headers: { "Authorization": `Bearer ${storedToken}` }
        })
            .then(res => {
                if (res.ok) return res.json();
                return [];
            })
            .then(data => {
                setComments(data)
                setLoading(false)
            })
            .catch(e => setLoading(false))

    }, [router])

    const handleDelete = async (commentId: string) => {
        if (!confirm("Delete this comment?")) return
        try {
            const res = await fetch(`http://localhost:3001/interactions/comments/${commentId}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (res.ok) {
                alert("Comment deleted")
                setComments(prev => prev.filter((c: any) => c.id !== commentId))
            }
        } catch (e) { console.error(e) }
    }

    if (loading) return <div className="p-8">Loading comments...</div>

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Comments Management</h1>
                    <p className="text-muted-foreground">Moderate user discussions.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Comments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Content</TableHead>
                                <TableHead>Context</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No comments found (or API not ready).</TableCell>
                                </TableRow>
                            ) : (
                                comments.map((comment: any) => (
                                    <TableRow key={comment.id}>
                                        <TableCell className="font-medium">{comment.user?.username || 'Unknown'}</TableCell>
                                        <TableCell className="max-w-md truncate" title={comment.content}>{comment.content}</TableCell>
                                        <TableCell>
                                            <Link href={`/book/${comment.bookId}`} className="text-blue-500 flex items-center gap-1 hover:underline">
                                                View Book <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        </TableCell>
                                        <TableCell>{new Date(comment.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(comment.id)}>
                                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

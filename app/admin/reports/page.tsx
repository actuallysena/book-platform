"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Ban, BookX, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function ReportsPage() {
    const router = useRouter()
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<'PENDING' | 'RESOLVED' | 'DISMISSED'>('PENDING')

    const fetchReports = async () => {
        const storedToken = localStorage.getItem("token")
        if (!storedToken) return router.push("/login")

        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/reports?status=${statusFilter}`, {
                headers: { "Authorization": `Bearer ${storedToken}` }
            })
            if (res.ok) {
                const data = await res.json()
                setReports(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [statusFilter, router])

    const updateReportStatus = async (id: string, newStatus: string) => {
        const storedToken = localStorage.getItem("token")
        if (!storedToken) return

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/reports/${id}/status`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${storedToken}` },
                body: JSON.stringify({ status: newStatus })
            })
            fetchReports() // Refresh
        } catch (e) {
            console.error(e)
            alert("Failed to update status")
        }
    }

    const handleSuspendBook = async (bookId: string) => {
        const storedToken = localStorage.getItem("token")
        const days = prompt("Suspend for how many days?", "7")
        const reason = prompt("Reason for suspension?", "Violation of terms")
        if (!days || !reason) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/books/${bookId}/suspend`, {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${storedToken}` },
                body: JSON.stringify({ suspendedUntil: new Date(Date.now() + parseInt(days) * 86400000), suspensionReason: reason })
            })
            if (res.ok) {
                alert("Book suspended successfully.")
                // Optionally resolve reports related to this book?
            } else {
                alert("Failed to suspend book.")
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleSuspendUser = async (userId: string) => {
        const storedToken = localStorage.getItem("token")
        const days = prompt("Suspend for how many days?", "7")
        if (!days) return

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/users/${userId}/suspend`, {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${storedToken}` },
                body: JSON.stringify({ days: parseInt(days) })
            });
            alert("User suspended.")
        } catch (e) {
            console.error(e)
            alert("Failed to suspend user.")
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("Delete this comment permanently?")) return
        const storedToken = localStorage.getItem("token")
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/interactions/comments/${commentId}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${storedToken}` }
            })
            if (res.ok) {
                alert("Comment deleted")
                fetchReports()
            }
        } catch (e) {
            console.error(e)
            alert("Failed to delete comment")
        }
    }

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Report Inbox</h1>
                    <p className="text-muted-foreground">Review user complaints and take action.</p>
                </div>
            </div>

            <div className="flex gap-2 border-b pb-2">
                {(['PENDING', 'RESOLVED', 'DISMISSED'] as const).map(status => (
                    <Button
                        key={status}
                        variant={statusFilter === status ? 'default' : 'ghost'}
                        onClick={() => setStatusFilter(status)}
                        className="text-sm"
                    >
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </Button>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reporter</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">Loading...</TableCell>
                                </TableRow>
                            ) : reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">No reports found.</TableCell>
                                </TableRow>
                            ) : (
                                reports.map((report: any) => (
                                    <TableRow key={report.id}>
                                        <TableCell>{report.reporter?.username || 'Unknown'}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={report.reason}>{report.reason}</TableCell>
                                        <TableCell>
                                            {report.targetUser && (
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-muted-foreground">USER</span>
                                                    <Link href={`/profile/${report.targetUser.username}`} className="text-blue-600 hover:underline">
                                                        @{report.targetUser.username}
                                                    </Link>
                                                </div>
                                            )}
                                            {report.targetBook && (
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-muted-foreground">BOOK</span>
                                                    <Link href={`/book/${report.targetBook.id}`} className="text-green-600 truncate max-w-[150px] hover:underline">
                                                        {report.targetBook.title}
                                                    </Link>
                                                    <span className="text-xs text-muted-foreground">by {report.targetBook.author?.username}</span>
                                                </div>
                                            )}
                                            {report.targetChapter && (
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-muted-foreground">CHAPTER</span>
                                                    <span className="text-indigo-600 truncate max-w-[150px]">{report.targetChapter.title}</span>
                                                    <span className="text-xs text-muted-foreground">in {report.targetChapter.book?.title}</span>
                                                </div>
                                            )}
                                            {report.targetComment && (
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-muted-foreground">COMMENT</span>
                                                    <span className="text-gray-600 italic truncate max-w-[150px]">"{report.targetComment.content}"</span>
                                                    <span className="text-xs text-muted-foreground">by {report.targetComment.user?.username}</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {statusFilter === 'PENDING' && (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => updateReportStatus(report.id, 'DISMISSED')}>
                                                        <XCircle className="h-4 w-4 mr-1" /> Dismiss
                                                    </Button>
                                                    <Button size="sm" variant="default" onClick={() => updateReportStatus(report.id, 'RESOLVED')}>
                                                        <CheckCircle className="h-4 w-4 mr-1" /> Resolve
                                                    </Button>
                                                </>
                                            )}

                                            {statusFilter === 'PENDING' && report.targetBook && (
                                                <Button size="sm" variant="destructive" onClick={() => handleSuspendBook(report.targetBook.id)}>
                                                    <BookX className="h-4 w-4" /> Suspend Book
                                                </Button>
                                            )}

                                            {/* Suspend User Action (For Reported User or Author of Content) */}
                                            {statusFilter === 'PENDING' && (
                                                ((report.targetUser) ||
                                                    (report.targetBook?.author) ||
                                                    (report.targetChapter?.book?.author) ||
                                                    (report.targetComment?.user)) &&
                                                <Button size="sm" variant="destructive" onClick={() => {
                                                    const userId = report.targetUser?.id ||
                                                        report.targetBook?.author?.id ||
                                                        report.targetChapter?.book?.author?.id ||
                                                        report.targetComment?.user?.id;
                                                    if (userId) handleSuspendUser(userId);
                                                }}>
                                                    <Ban className="h-4 w-4" /> Suspend User
                                                </Button>
                                            )}

                                            {statusFilter === 'PENDING' && report.targetComment && (
                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteComment(report.targetComment.id)}>
                                                    <XCircle className="h-4 w-4" /> Delete Comment
                                                </Button>
                                            )}
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

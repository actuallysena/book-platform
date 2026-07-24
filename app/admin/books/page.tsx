"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trash2, Ban, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BooksPage() {
    const router = useRouter()
    const [books, setBooks] = useState<any[]>([])
    const [suspendedBooks, setSuspendedBooks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("all")

    const [token, setToken] = useState("")
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")

        if (!storedUser || !storedToken) {
            router.push("/login")
            return
        }
        setToken(storedToken)
        setCurrentUser(JSON.parse(storedUser))

        fetchBooks(storedToken)
        fetchSuspendedBooks(storedToken)
    }, [router])

    const fetchBooks = (authToken: string) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/books`)
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }

    const fetchSuspendedBooks = (authToken: string) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/admin/suspended-books`, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(res => res.json())
            .then(data => setSuspendedBooks(data))
            .catch(err => console.error(err))
    }

    const handleSuspend = async (bookId: string) => {
        const days = prompt("Suspend for how many days?", "7")
        const reason = prompt("Suspension reason?", "Policy violation")
        if (!days || !reason) return

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/books/${bookId}/suspend`, {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ suspendedUntil: new Date(Date.now() + parseInt(days) * 86400000), suspensionReason: reason })
            })
            alert("Book suspended")
            fetchBooks(token)
            fetchSuspendedBooks(token)
        } catch (e) {
            console.error(e)
            alert("Failed")
        }
    }

    const handleUnsuspend = async (bookId: string) => {
        if (!confirm("Lift suspension?")) return
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/books/${bookId}/unsuspend`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` }
            })
            alert("Suspension lifted")
            fetchBooks(token)
            fetchSuspendedBooks(token)
        } catch (e) {
            console.error(e)
        }
    }

    const handleDelete = async (bookId: string) => {
        if (!confirm("Delete permanently?")) return
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/books/${bookId}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            })
            fetchBooks(token)
            fetchSuspendedBooks(token)
        } catch (e) {
            console.error(e)
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Book Management</h1>
                    <p className="text-muted-foreground">Manage platform content and suspensions.</p>
                </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All Books</TabsTrigger>
                    <TabsTrigger value="suspended">Suspended Books <Badge variant="destructive" className="ml-2">{suspendedBooks.length}</Badge></TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>All Books</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {books.map((book: any) => (
                                        <TableRow key={book.id}>
                                            <TableCell className="font-medium">{book.title}</TableCell>
                                            <TableCell>{book.author?.username}</TableCell>
                                            <TableCell>
                                                <Badge variant={book.status === 'SUSPENDED' ? 'destructive' : 'secondary'}>{book.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                {book.status !== 'SUSPENDED' && (
                                                    <Button size="sm" variant="outline" onClick={() => handleSuspend(book.id)}>
                                                        <Ban className="h-4 w-4 mr-1" /> Suspend
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(book.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suspended" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Suspended Books</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Until</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suspendedBooks.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center">No suspended books.</TableCell></TableRow> :
                                        suspendedBooks.map((book: any) => (
                                            <TableRow key={book.id}>
                                                <TableCell className="font-medium">{book.title}</TableCell>
                                                <TableCell>{book.suspensionReason}</TableCell>
                                                <TableCell>{book.suspendedUntil ? new Date(book.suspendedUntil).toLocaleDateString() : 'Indefinite'}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button size="sm" variant="default" onClick={() => handleUnsuspend(book.id)}>
                                                        <CheckCircle className="h-4 w-4 mr-1" /> Lift Suspension
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

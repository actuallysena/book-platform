"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Ban, CheckCircle, Edit } from "lucide-react"

export default function UsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
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

        const parsedUser = JSON.parse(storedUser)
        setCurrentUser(parsedUser)
        if (parsedUser.role !== "ADMIN" && parsedUser.role !== "MODERATOR") {
            router.push("/")
            return
        }

        fetchUsers(storedToken)
    }, [router])

    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState<'ALL' | 'SUSPENDED'>('ALL')

    const fetchUsers = (authToken: string) => {
        const url = searchTerm
            ? `http://localhost:3001/users?search=${encodeURIComponent(searchTerm)}`
            : "http://localhost:3001/users"

        fetch(url, {
            headers: { "Authorization": `Bearer ${authToken}` }
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data)
                setLoading(false)
            })
            .catch(err => console.error(err))
    }

    // Debounce search
    useEffect(() => {
        if (!token) return;
        const timer = setTimeout(() => {
            fetchUsers(token)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm, token])

    const filteredUsers = users.filter((user: any) => {
        if (filter === 'ALL') return true;
        if (filter === 'SUSPENDED') return user.suspendedUntil && new Date(user.suspendedUntil) > new Date();
        return true;
    });


    const handleSuspend = async (userId: string) => {
        const daysStr = prompt("How many days to suspend? (0 for permanent)", "7")
        if (daysStr === null) return
        const days = parseInt(daysStr)
        const reason = prompt("Reason for suspension:", "Violation of rules") || "Violation"

        try {
            const res = await fetch(`http://localhost:3001/users/${userId}/suspend`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ days, reason })
            })
            if (res.ok) {
                alert("User suspended")
                fetchUsers(token)
            } else {
                alert("Failed to suspend")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleUnsuspend = async (userId: string) => {
        if (!confirm("Are you sure you want to lift the suspension?")) return

        try {
            const res = await fetch(`http://localhost:3001/users/${userId}/unsuspend`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (res.ok) {
                alert("User unsuspended")
                fetchUsers(token)
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <div className="p-8">Loading users...</div>

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage users and suspensions.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <div className="flex gap-4 mt-4">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
                        />
                        <div className="flex bg-muted rounded-md p-1 items-center">
                            <Button
                                variant={filter === 'ALL' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setFilter('ALL')}
                            >
                                All
                            </Button>
                            <Button
                                variant={filter === 'SUSPENDED' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setFilter('SUSPENDED')}
                            >
                                Suspended
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user: any) => {
                                const isSuspended = user.suspendedUntil && new Date(user.suspendedUntil) > new Date()
                                return (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                        <TableCell>
                                            {isSuspended ? (
                                                <Badge variant="destructive">Suspended</Badge>
                                            ) : (
                                                <Badge variant="default" className="bg-green-600">Active</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button size="sm" variant="outline" onClick={() => router.push(`/admin/users/${user.id}`)}>
                                                <Edit className="h-4 w-4 mr-1" /> Edit
                                            </Button>
                                            {isSuspended ? (
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-200" onClick={() => handleUnsuspend(user.id)}>
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Unban
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="destructive" onClick={() => handleSuspend(user.id)}>
                                                    <Ban className="h-4 w-4 mr-1" /> Suspend
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

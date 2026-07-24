"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, FolderTree, Settings, ShieldAlert, Plus } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<any>({ totalUsers: 0, totalBooks: 0, pendingReports: 0 })

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/login")
                return
            }

            try {
                // Determine API URL inside useEffect to avoid mismatches
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

                // Get User Profile first to verify role (Redundant if handled by middleware/backend response but good UX)
                const userRes = await fetch(`${apiUrl}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (userRes.ok) {
                    const userData = await userRes.json()
                    if (userData.role !== "ADMIN" && userData.role !== "MODERATOR") {
                        router.push("/")
                        return
                    }
                    setUser(userData)
                } else {
                    router.push("/login")
                    return
                }

                // Get Stats
                const statsRes = await fetch(`${apiUrl}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (statsRes.ok) {
                    const data = await statsRes.json()
                    setStats(data)
                }
            } catch (error) {
                console.error("Failed to fetch admin data", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [router])

    if (loading) {
        return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
    }

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.username}. Manage your platform.</p>
                </div>
                <div className="flex gap-2">
                    {/* <Link href="/admin/categories/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> New Category
                        </Button>
                    </Link> */}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBooks}</div>
                        <p className="text-xs text-muted-foreground">Published works</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                        <ShieldAlert className={`h-4 w-4 ${stats.pendingReports > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingReports}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/admin/users">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer block h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">Suspend/Ban actions</div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/reports">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer block h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Reports Inbox</CardTitle>
                            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">Review complaints</div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/books">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer block h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Manage Books</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">Suspend/Delete content</div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}

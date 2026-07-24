"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookCard } from "@/components/book-card"
import { MapPin, Calendar, BookOpen, Users } from "lucide-react"
import { ReportModal } from "@/components/report-modal"
import { useRouter } from "next/navigation"
import { fetchAPI, getImageUrl } from "@/lib/api"
import { format } from "date-fns"

export default function UserProfilePage({ params }: { params: { username: string } }) {
    const [activeTab, setActiveTab] = useState("books")
    const [userData, setUserData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const router = useRouter()

    // Decode username from URL
    const username = decodeURIComponent(params.username)

    useEffect(() => {
        // Check if viewing own profile
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            const currentUser = JSON.parse(storedUser)
            // If the URL username matches the logged in username (case insensitive)
            if (currentUser.username && username.toLowerCase() === currentUser.username.toLowerCase()) {
                router.replace("/profile")
            }
        }
    }, [username, router])

    useEffect(() => {
        const loadProfile = async () => {
            // Remove '@' if present for API call, though endpoint likely expects raw username
            // Usually username in URL might not have @ unless manually typed.
            // Params username usually plain.
            const apiUsername = username.startsWith('@') ? username.substring(1) : username;

            try {
                // Fetch user profile with books
                const data = await fetchAPI(`/users/profile/${apiUsername}`)
                if (data) {
                    console.log("Profile Data:", data)
                    setUserData(data)
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error("Failed to load profile", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [username])

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            </div>
        )
    }

    if (error || !userData) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-2xl font-bold">User not found</h1>
                    <p className="text-muted-foreground">The user @{username} could not be found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Profile Header */}
                <section className="border-b border-border bg-gradient-to-b from-accent/20 to-background">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                            {/* Avatar */}
                            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                <AvatarImage src={getImageUrl(userData.avatar) || "/placeholder.svg"} />
                                <AvatarFallback className="text-3xl">{(userData.name || userData.username)[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>

                            {/* Profile Info */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">{userData.name || userData.username}</h1>
                                    <p className="text-muted-foreground">@{userData.username}</p>
                                </div>

                                <p className="text-foreground leading-relaxed max-w-2xl">{userData.bio || "No bio yet."}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    {userData.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {userData.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Joined {userData.createdAt ? format(new Date(userData.createdAt), 'MMMM yyyy') : 'Unknown'}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-6">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                            <span className="font-semibold text-lg">{userData._count?.books || 0}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Books</p>
                                    </div>
                                    {/* Followers/Following - Hidden if not supported/zero or implemented later */}
                                    {/* 
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            <span className="font-semibold text-lg">{userData._count?.followers || 0}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Followers</p>
                                    </div>
                                    */}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3">
                                    <Button disabled>Follow</Button>
                                    <Button variant="outline" className="bg-transparent" disabled>
                                        Message
                                    </Button>
                                    {/* Report Button */}
                                    <ReportModal targetUserId={userData.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Profile Content */}
                <section className="py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="mb-8">
                                <TabsTrigger value="books">Books</TabsTrigger>
                                <TabsTrigger value="about">About</TabsTrigger>
                            </TabsList>

                            <TabsContent value="books" className="space-y-6">
                                {userData.books && userData.books.length > 0 ? (
                                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
                                        {userData.books.map((book: any) => (
                                            <BookCard
                                                key={book.id}
                                                id={book.id}
                                                title={book.title}
                                                author={userData.username} // Or userData.name
                                                cover={getImageUrl(book.coverImage)}
                                                likes={book._count?.likes || 0}
                                                reads={book.viewCount || 0}
                                                rating={0}
                                                tags={book.category ? [book.category.name] : []}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-12">
                                        No books published yet.
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="about" className="space-y-6">
                                <div className="text-muted-foreground py-4">
                                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                                    <p>{userData.bio || "No bio available."}</p>
                                    {userData.website && (
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold mb-2">Website</h3>
                                            <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                {userData.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

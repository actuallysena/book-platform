"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

export default function EditUserPage() {
    const router = useRouter()
    const params = useParams()
    const userId = params.id as string

    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [token, setToken] = useState("")

    // Form states
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        bio: "",
        location: ""
    })

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")

        if (!storedUser || !storedToken) {
            router.push("/login")
            return
        }
        setToken(storedToken)

        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.role !== "ADMIN") {
            router.push("/")
            return
        }

        fetchUser(userId, storedToken)
    }, [router, userId])

    const fetchUser = (id: string, authToken: string) => {
        // Assuming GET /users/:id exists
        // If not, we might need to filter from all users if backend is limited, 
        // but for a scalable app we assume specific endpoint.
        fetch(`http://localhost:3001/users/${id}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch user")
                return res.json()
            })
            .then(data => {
                setUser(data)
                setFormData({
                    username: data.username || "",
                    email: data.email || "",
                    bio: data.bio || "",
                    location: data.location || ""
                })
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                alert("Error fetching user details")
                router.push("/admin/users")
            })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const res = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'PATCH', // or PUT depending on backend
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                alert("User updated successfully")
                router.push("/admin/users")
            } else {
                throw new Error("Failed to update user")
            }
        } catch (error) {
            console.error(error)
            alert("Failed to update user. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                    <p className="text-muted-foreground">Update user profile information</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>
                        Make changes to the user's public profile.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

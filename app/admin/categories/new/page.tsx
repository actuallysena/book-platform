"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function NewCategoryPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [color, setColor] = useState("from-blue-500/20 to-cyan-500/20")
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState("")

    useEffect(() => {
        // Check auth
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")

        if (!storedUser || !storedToken) {
            router.push("/login")
            return
        }

        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.role !== "ADMIN") {
            router.push("/")
            return
        }

        setToken(storedToken)
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("http://localhost:3001/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, slug, color }),
            })

            if (!res.ok) {
                throw new Error("Failed to create category")
            }

            alert("Category created successfully!")
            router.push("/admin")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Error creating category")
        } finally {
            setLoading(false)
        }
    }

    // Auto-generate slug from name
    const handleNameChange = (val: string) => {
        setName(val)
        setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }

    return (
        <div className="p-6 md:p-8 flex items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <CardTitle>Create New Category</CardTitle>
                    </div>
                    <CardDescription>Add a new category to the platform.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Science Fiction"
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input
                                id="slug"
                                placeholder="e.g. science-fiction"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">Gradient Color Class</Label>
                            <Input
                                id="color"
                                placeholder="e.g. from-blue-500/20 to-cyan-500/20"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Tailwind CSS gradient classes (from-X to-Y)</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating..." : "Create Category"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

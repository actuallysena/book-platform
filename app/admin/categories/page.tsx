"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CategoriesPage() {
    const router = useRouter()
    const [categories, setCategories] = useState([])
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
        if (parsedUser.role !== "ADMIN") {
            router.push("/")
            return
        }

        fetchCategories()
    }, [router])

    const fetchCategories = () => {
        fetch("http://localhost:3001/categories")
            .then(res => res.json())
            .then(data => {
                setCategories(data)
                setLoading(false)
            })
            .catch(err => console.error(err))
    }

    const handleDelete = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return

        try {
            const res = await fetch(`http://localhost:3001/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (res.ok) {
                alert("Category deleted")
                fetchCategories()
            } else {
                alert("Failed to delete category")
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <div className="p-8">Loading categories...</div>

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground">Manage book categories.</p>
                    </div>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> New Category
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Color Preview</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No categories found.</TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category: any) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category.slug}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`bg-gradient-to-r ${category.color || 'from-gray-500/20 to-gray-500/20'}`}>
                                                Preview
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id)}>
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

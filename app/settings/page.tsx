"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Loader2, Camera } from "lucide-react"
import { getImageUrl } from "@/lib/api"
import { ImageCropper } from "@/components/image-cropper"

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
    })

    // Image Upload State
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<Blob | null>(null)

    // Cropper State
    const [cropperOpen, setCropperOpen] = useState(false)
    const [selectedImageStr, setSelectedImageStr] = useState<string | null>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            const parsed = JSON.parse(storedUser)
            setUser(parsed)
            setAvatarPreview(getImageUrl(parsed.avatar))

            // Fetch latest data to populate form
            fetch(`http://localhost:3001/users/${parsed.id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        name: data.name || "",
                        bio: data.bio || "",
                    })
                    if (data.avatar) {
                        setAvatarPreview(getImageUrl(data.avatar))
                    }
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    setLoading(false)
                })
        } else {
            router.push("/login")
        }
    }, [router])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Read file as data URL to pass to cropper
            const reader = new FileReader()
            reader.onload = (e) => {
                setSelectedImageStr(e.target?.result as string)
                setCropperOpen(true)
                // Clear input value so same file can be selected again if cancelled
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCropComplete = (croppedBlob: Blob) => {
        setAvatarFile(croppedBlob)
        setAvatarPreview(URL.createObjectURL(croppedBlob))
        setCropperOpen(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const token = localStorage.getItem("token")
            let avatarUrl = user.avatar

            // Upload avatar if changed
            if (avatarFile) {
                const uploadFormData = new FormData()
                // Append as file with filename
                uploadFormData.append("file", avatarFile, "avatar.jpg")

                const uploadRes = await fetch(`http://localhost:3001/uploads`, {
                    method: "POST",
                    body: uploadFormData
                })

                if (uploadRes.ok) {
                    const data = await uploadRes.json()
                    avatarUrl = data.url
                } else {
                    console.error("Failed to upload avatar")
                    // Proceed without updating avatar if upload fails, or handle error?
                    // For now, alerting user might be better but continuing preserves other changes
                }
            }

            const res = await fetch(`http://localhost:3001/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    avatar: avatarUrl
                })
            })

            if (res.ok) {
                const updatedUser = await res.json()
                // Update local storage to reflect changes immediately
                localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }))
                // Refresh user state to show new avatar in typical navbar etc if they listen to local storage or just reload
                window.location.href = "/profile" // Hard navigation to ensure all components update
            } else {
                console.error("Failed to update profile")
                alert("Failed to save changes")
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            alert("Error updating profile")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>Manage your public profile information.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-6">
                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center gap-4">
                                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                        <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                                        <AvatarFallback className="text-3xl">
                                            {(formData.name || user.username || "U")[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                                            <div className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm shadow-sm hover:bg-accent transition-colors">
                                                <Camera className="h-4 w-4" />
                                                Change Photo
                                            </div>
                                        </Label>
                                        <Input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center max-w-[200px]">
                                        Click "Change Photo" to upload and adjust your profile picture.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        placeholder="Tell us about yourself..."
                                        className="min-h-[120px]"
                                        value={formData.bio}
                                        onChange={handleChange}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/500</p>
                                </div>

                            </CardContent>
                            <CardFooter className="flex justify-between border-t px-6 py-4">
                                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    <ImageCropper
                        imageSrc={selectedImageStr}
                        isOpen={cropperOpen}
                        onClose={() => setCropperOpen(false)}
                        onCropComplete={handleCropComplete}
                    />

                </div>
            </main>
            <Footer />
        </div>
    )
}

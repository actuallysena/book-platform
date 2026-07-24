"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Globe, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export default function CreateCommunityPage() {
  const router = useRouter()
  const [communityName, setCommunityName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [requireApproval, setRequireApproval] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle community creation
    console.log("[v0] Creating community:", { communityName, description, isPrivate, requireApproval })
    router.push("/communities")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/communities">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Communities
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create a Community</h1>
          <p className="mt-2 text-muted-foreground">
            Build a space for readers and writers to connect and share their passion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Community Avatar */}
          <Card>
            <CardHeader>
              <CardTitle>Community Avatar</CardTitle>
              <CardDescription>Upload an image that represents your community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <Button type="button" variant="outline">
                  Upload Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Community Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Fantasy Writers Guild"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your community is about..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control who can see and join your community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={isPrivate ? "private" : "public"} onValueChange={(v) => setIsPrivate(v === "private")}>
                <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4">
                  <RadioGroupItem value="public" id="public" />
                  <div className="flex-1">
                    <Label htmlFor="public" className="flex items-center gap-2 font-medium cursor-pointer">
                      <Globe className="h-4 w-4" />
                      Public Community
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Anyone can see and join this community</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4">
                  <RadioGroupItem value="private" id="private" />
                  <div className="flex-1">
                    <Label htmlFor="private" className="flex items-center gap-2 font-medium cursor-pointer">
                      <Lock className="h-4 w-4" />
                      Private Community
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Only members can see content and join by invitation or request
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="approval" className="font-medium">
                    Require Approval
                  </Label>
                  <p className="text-sm text-muted-foreground">Manually approve new members before they can join</p>
                </div>
                <Switch id="approval" checked={requireApproval} onCheckedChange={setRequireApproval} />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Create Community
            </Button>
            <Link href="/communities" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

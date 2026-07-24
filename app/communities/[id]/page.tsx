"use client"

import type React from "react"

import { useState } from "react"
import {
  Hash,
  Volume2,
  Calendar,
  Settings,
  UserPlus,
  ChevronDown,
  Send,
  Smile,
  Plus,
  Shield,
  ArrowLeft,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data
const community = {
  id: "1",
  name: "Fantasy Writers Guild",
  avatar: "/fantasy-guild-icon.jpg",
  memberCount: 1234,
}

const channels = [
  { id: "1", name: "general", type: "text" as const, category: "Text Channels" },
  { id: "2", name: "introductions", type: "text" as const, category: "Text Channels" },
  { id: "3", name: "writing-tips", type: "text" as const, category: "Text Channels" },
  { id: "4", name: "feedback", type: "text" as const, category: "Text Channels" },
  { id: "5", name: "voice-chat", type: "voice" as const, category: "Voice Channels" },
  { id: "6", name: "reading-sessions", type: "voice" as const, category: "Voice Channels" },
  { id: "7", name: "book-club", type: "text" as const, category: "Reading Groups" },
  { id: "8", name: "monthly-challenge", type: "event" as const, category: "Events" },
]

const messages = [
  {
    id: "1",
    author: { name: "Sarah Chen", username: "sarahwrites", avatar: "/user-avatar-1.jpg" },
    content: "Just finished the first chapter of my new fantasy novel! Anyone want to beta read?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    author: { name: "Mike Johnson", username: "mikej", avatar: "/user-avatar-2.jpg" },
    content: "I'd love to! What's it about?",
    timestamp: "10:32 AM",
  },
  {
    id: "3",
    author: { name: "Sarah Chen", username: "sarahwrites", avatar: "/user-avatar-1.jpg" },
    content:
      "It's about a young mage discovering an ancient prophecy. Think Harry Potter meets Lord of the Rings vibes!",
    timestamp: "10:33 AM",
  },
  {
    id: "4",
    author: { name: "Emma Davis", username: "emmareads", avatar: "/user-avatar-3.jpg" },
    content: "That sounds amazing! Count me in for beta reading 📚",
    timestamp: "10:35 AM",
  },
]

export default function CommunityPage({ params }: { params: { id: string } }) {
  const [selectedChannel, setSelectedChannel] = useState(channels[0])
  const [message, setMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const groupedChannels = channels.reduce(
    (acc, channel) => {
      if (!acc[channel.category]) {
        acc[channel.category] = []
      }
      acc[channel.category].push(channel)
      return acc
    },
    {} as Record<string, typeof channels>,
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      console.log("[v0] Sending message:", message)
      setMessage("")
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${sidebarOpen ? "w-60" : "w-0"} md:w-60 flex-shrink-0 border-r border-border transition-all duration-300 overflow-hidden`}
        >
          <div className="flex h-full flex-col">
            {/* Community Header */}
            <div className="flex items-center border-b border-border">
              <Link href="/communities" className="md:hidden p-3">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-1 h-12 items-center justify-between px-4 hover:bg-accent transition-colors">
                    <span className="font-semibold truncate">{community.name}</span>
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite People
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/communities/${params.id}/settings`}>
                      <Settings className="mr-2 h-4 w-4" />
                      Community Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/communities/${params.id}/applications`}>
                      <Shield className="mr-2 h-4 w-4" />
                      Review Applications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Leave Community</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Channels List */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-4">
                {Object.entries(groupedChannels).map(([category, categoryChannels]) => (
                  <div key={category}>
                    <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase mb-1">{category}</h3>
                    <div className="space-y-0.5">
                      {categoryChannels.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => setSelectedChannel(channel)}
                          className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                            selectedChannel.id === channel.id
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          }`}
                        >
                          {channel.type === "text" && <Hash className="h-4 w-4" />}
                          {channel.type === "voice" && <Volume2 className="h-4 w-4" />}
                          {channel.type === "event" && <Calendar className="h-4 w-4" />}
                          <span className="truncate">{channel.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Add Channel Button */}
            <div className="border-t border-border p-2">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Add Channel
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Channel Header */}
          <div className="flex h-12 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2 min-w-0">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="h-5 w-5" />
              </Button>
              {selectedChannel.type === "text" && <Hash className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
              {selectedChannel.type === "voice" && <Volume2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
              {selectedChannel.type === "event" && <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
              <h2 className="font-semibold truncate">{selectedChannel.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3 group">
                  <Link href={`/profile/${msg.author.username}`}>
                    <Avatar className="h-10 w-10 cursor-pointer">
                      <AvatarImage src={msg.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{msg.author.name[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <Link
                        href={`/profile/${msg.author.username}`}
                        className="font-semibold hover:underline cursor-pointer"
                      >
                        {msg.author.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm mt-1 text-foreground">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border p-2 sm:p-4">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon" className="hidden sm:flex">
                <Plus className="h-5 w-5" />
              </Button>
              <Input
                placeholder={`Message #${selectedChannel.name}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" className="hidden sm:flex">
                <Smile className="h-5 w-5" />
              </Button>
              <Button type="submit" size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right Sidebar - Members (optional) */}
        <div className="hidden xl:block w-60 border-l border-border">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
              Members — {community.memberCount}
            </h3>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-2">
                {[...Array(20)].map((_, i) => (
                  <Link key={i} href={`/profile/user${i}`}>
                    <div className="flex items-center gap-2 rounded p-2 hover:bg-accent cursor-pointer transition-colors">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/user-avatar-${(i % 3) + 1}.jpg`} />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                      </div>
                      <span className="text-sm truncate">User {i + 1}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { getImageUrl } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Notification {
    id: string
    type: string
    read: boolean
    createdAt: string
    message: string
    entityId: string
    actor: {
        username: string
        avatar: string
    }
}

export function NotificationsPopover() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const fetchNotifications = async () => {
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/notifications`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setNotifications(data)
                setUnreadCount(data.filter((n: Notification) => !n.read).length)
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error)
        }
    }

    // Poll for notifications every 30 seconds
    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const markAsRead = async (id: string, entityId: string, type: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))

        try {
            const token = localStorage.getItem("token")
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/notifications/${id}/read`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            })

            // Navigate logic
            if (['REPLY', 'COMMENT', 'LIKE'].includes(type)) {
                const navRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/notifications/${id}/navigate`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (navRes.ok) {
                    const data = await navRes.json();
                    if (data.url) {
                        router.push(data.url);
                    }
                }
            }

        } catch (e) {
            console.error("Notification action failed", e)
        }

        setIsOpen(false)
    }

    const handleMarkAllRead = async () => {
        // TODO: Implement bulk read endpoint or just loop
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs h-auto p-0" onClick={handleMarkAllRead}>
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No notifications yet
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    className={cn(
                                        "w-full flex items-start gap-3 p-4 text-left hover:bg-muted/50 transition-colors",
                                        !notification.read && "bg-muted/20"
                                    )}
                                    onClick={() => markAsRead(notification.id, notification.entityId, notification.type)}
                                >
                                    <Avatar className="h-8 w-8 mt-1 border">
                                        <AvatarImage src={getImageUrl(notification.actor.avatar)} />
                                        <AvatarFallback>{notification.actor.username[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm leading-none">
                                            <span className="font-medium">{notification.actor.username}</span>{" "}
                                            <span className="text-muted-foreground">
                                                {notification.type === 'REPLY' && 'replied to you'}
                                                {notification.type === 'COMMENT' && 'commented on your book'}
                                                {notification.type === 'LIKE' && 'liked your book'}
                                                {notification.type === 'FOLLOW' && 'started following you'}
                                            </span>
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <span className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}

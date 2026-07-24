"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// Ensure you have these icons or similar ones
import {
    LayoutDashboard,
    Users,
    BookOpen,
    FolderTree,
    ShieldAlert,
    Settings,
    LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Books",
        href: "/admin/books",
        icon: BookOpen,
    },
    {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: ShieldAlert,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden border-r bg-muted/40 md:block w-64 min-h-screen">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span className="">StoryVerse Admin</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <Link href="/">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                            <LogOut className="h-4 w-4" />
                            Exit Admin
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Users, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const pathname = usePathname()

    // Hide on Studio Editor pages
    if (pathname.includes("/studio/book")) {
        return null
    }


    const links = [
        {
            href: "/",
            label: "Home",
            icon: Home,
        },
        {
            href: "/search",
            label: "Search",
            icon: Search,
        },
        {
            href: "/communities",
            label: "Communities",
            icon: Users,
        },
        {
            href: "/profile",
            label: "Profile",
            icon: User,
        },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
            <div className="flex items-center justify-around border-t bg-background/80 backdrop-blur-lg px-2 py-2">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 min-w-[64px] rounded-lg p-2 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-6 w-6", isActive && "fill-current/20")} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

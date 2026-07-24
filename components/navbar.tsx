"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Moon, Sun, BookOpen, User, PenTool, Users, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationsPopover } from "@/components/notifications-popover"

export function Navbar({ variant = "default", children }: { variant?: "default" | "studio", children?: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setIsLoggedIn(true)
      try {
        const parsed = JSON.parse(user)
        if (parsed.role === 'ADMIN') setIsAdmin(true)
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setIsAdmin(false)
    router.push("/")
    router.refresh()
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">StoryVerse</span>
          </Link>

          {variant === "default" && (
            <>
              {/* Search Bar - Desktop */}
              <div className="hidden flex-1 max-w-md mx-8 md:flex">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search books, authors, tags..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="gap-2 text-primary">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                {isLoggedIn && (
                  <>
                    <Link href="/communities">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Users className="h-4 w-4" />
                        Communities
                      </Button>
                    </Link>
                    <Link href="/studio">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <PenTool className="h-4 w-4" />
                        Write
                      </Button>
                    </Link>
                    <NotificationsPopover />
                  </>
                )}
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                {isLoggedIn ? (
                  <>
                    <Link href="/profile">
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </>
          )}

          {variant === "studio" && (
            <div className="flex items-center gap-2">
              {children ? children : <div className="text-sm font-medium text-muted-foreground hidden sm:block">Studio</div>}
            </div>
          )}

        </div>
        {/* Mobile Menu Button used to be here, effectively removed for studio variant by scope of changes */}
        {variant === "default" && (
          <div className="flex items-center gap-1 md:hidden absolute right-4 top-4">
            {isLoggedIn && (
              <Link href="/studio">
                <Button variant="ghost" size="icon">
                  <PenTool className="h-5 w-5" />
                </Button>
              </Link>
            )}
            {isLoggedIn && <NotificationsPopover />}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}

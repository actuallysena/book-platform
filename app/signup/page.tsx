"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Loader2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: "", color: "bg-muted", isValid: false })

  const checkPasswordStrength = (pass: string) => {
    let score = 0
    let message = ""
    let color = "bg-muted"

    if (!pass) return { score: 0, message: "", color: "bg-muted", isValid: false }

    // 1. Length Check
    if (pass.length >= 8) score += 1

    // 2. Letters & Numbers Check
    const hasLetters = /[a-zA-Z]/.test(pass)
    const hasNumbers = /\d/.test(pass)
    if (hasLetters && hasNumbers) score += 1

    // 3. Repeating Characters Check (e.g., "111", "aaa")
    const hasRepeats = /(.)\1{2,}/.test(pass)
    if (!hasRepeats && pass.length > 0) score += 1

    // 4. Bonus: Special Characters or Mixed Case
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass)
    const hasMixed = /[a-z]/.test(pass) && /[A-Z]/.test(pass)
    if (hasSpecial || hasMixed) score += 1

    // 5. Enhanced Security Checks
    const lowerPass = pass.toLowerCase()
    const hasCommonWords = lowerPass.includes("password") || lowerPass.includes("sifre") || lowerPass.includes("şifre") || lowerPass.includes("123456") || lowerPass.includes("123")
    const hasSequentialDigits = /(012|123|234|345|456|567|678|789|890)/.test(pass)

    // Determine Status
    if (pass.length < 6) {
      message = "Too short (min 6 characters)"
      color = "bg-red-500"
      score = 1 // Visual only, effectively weak
    } else if (hasCommonWords) {
      message = "Password contains common words/sequences"
      color = "bg-red-500"
      score = 1
    } else if (hasSequentialDigits) {
      message = "Avoid sequential digits (e.g. 123)"
      color = "bg-orange-500"
      score = 2
    } else if (!hasLetters || !hasNumbers) {
      message = "Must contain numbers & letters"
      color = "bg-orange-500"
      score = 2
    } else if (hasRepeats) {
      message = "Avoid repeating characters (e.g. 111)"
      color = "bg-yellow-500"
      score = 2
    } else if (score >= 4) {
      message = "Strong password"
      color = "bg-green-500"
    } else {
      message = "Good password"
      color = "bg-blue-500"
    }

    // Hard fail condition for "Weak"
    const isValid = pass.length >= 6 && hasLetters && hasNumbers && !hasRepeats && !hasCommonWords && !hasSequentialDigits

    return { score, message, color, isValid }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    // Strict Username Validation: Only alphanumeric and underscores
    if (id === 'username') {
      const strictUsernameRegex = /^[a-zA-Z0-9_]*$/
      if (!strictUsernameRegex.test(value)) {
        // Don't update state if invalid char typed (e.g. space, @, emoji)
        // Ideally we'd show an error, but preventing input is also UX option. 
        // Better: update state but show validation error.
        // For now, let's just allow it but we'll validate on submit or show error?
        // User requested "standard chars only", preventing input is strongest.
        return
      }
    }

    setFormData({ ...formData, [id]: value })

    if (id === "password") {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    const strength = checkPasswordStrength(formData.password)
    if (!strength.isValid) {
      alert("Password is too weak: " + strength.message)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      // 1. Register the user
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Registration failed")
      }

      // 2. (Optional) Auto-login or redirect. Current plan: Redirect to login.
      alert("Account created successfully! Please sign in.")
      router.push("/login")

    } catch (error: any) {
      console.error(error)
      alert(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Join our community of readers and writers</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {formData.password && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                    <div className={`h-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 4) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">{passwordStrength.message}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" size="lg" disabled={loading || !passwordStrength.isValid}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

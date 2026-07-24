"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Flag } from "lucide-react"

interface ReportModalProps {
    targetUserId?: string
    targetBookId?: string
    targetChapterId?: string
    targetCommentId?: string
    trigger?: React.ReactNode
}

export function ReportModal({ targetUserId, targetBookId, targetChapterId, targetCommentId, trigger }: ReportModalProps) {
    const [open, setOpen] = useState(false)
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
            alert("Please login to report content.")
            setLoading(false)
            return
        }

        try {
            const res = await fetch("http://localhost:3001/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    reason,
                    targetUserId,
                    targetBookId,
                    targetChapterId,
                    targetCommentId
                })
            })

            if (res.ok) {
                alert("Report submitted successfully. Thank you for helping keep our community safe.")
                setOpen(false)
                setReason("")
            } else {
                alert("Failed to submit report.")
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                        <Flag className="h-4 w-4 mr-2" /> Report
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report Content</DialogTitle>
                    <DialogDescription>
                        Please describe why you are reporting this content. Our moderation team will review it shortly.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                            id="reason"
                            placeholder="Inappropriate content, spam, harassment, etc..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" variant="destructive" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Submitting..." : "Submit Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-muted/20">
            {/* Desktop Sidebar */}
            <AdminSidebar />

            {/* Mobile Nav Trigger */}
            <div className="md:hidden flex items-center p-4 border-b bg-background">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <AdminSidebar />
                    </SheetContent>
                </Sheet>
                <span className="font-bold ml-4">Admin Panel</span>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    )
}

import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        totalUsers: number;
        totalBooks: number;
        pendingReports: number;
    }>;
    getSuspendedBooks(search?: string): Promise<({
        author: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            suspendedUntil: Date | null;
            suspensionReason: string | null;
            email: string;
            password: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            name: string | null;
            avatar: string | null;
            bio: string | null;
            location: string | null;
            website: string | null;
        };
    } & {
        id: string;
        title: string;
        description: string | null;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BookStatus;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        categoryId: string | null;
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
    })[]>;
    getSuspendedUsers(search?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
    }[]>;
}

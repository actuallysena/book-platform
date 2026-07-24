import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        createdAt: Date;
        updatedAt: Date;
        suspendedUntil: Date | null;
        suspensionReason: string | null;
    }>;
    findAll(search?: string): Promise<{
        id: string;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        createdAt: Date;
        updatedAt: Date;
        suspendedUntil: Date | null;
        suspensionReason: string | null;
    }[]>;
    findOne(id: string): Promise<{
        books: ({
            _count: {
                likes: number;
                chapters: number;
            };
            category: {
                id: string;
                name: string;
                slug: string;
                color: string | null;
            };
            author: {
                id: string;
                email: string;
                password: string;
                username: string;
                role: import(".prisma/client").$Enums.Role;
                name: string | null;
                avatar: string | null;
                bio: string | null;
                location: string | null;
                website: string | null;
                createdAt: Date;
                updatedAt: Date;
                suspendedUntil: Date | null;
                suspensionReason: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            suspendedUntil: Date | null;
            suspensionReason: string | null;
            title: string;
            description: string | null;
            coverImage: string | null;
            authorId: string;
            categoryId: string | null;
            tags: string[];
            status: import(".prisma/client").$Enums.BookStatus;
            viewCount: number;
        })[];
        _count: {
            books: number;
        };
    } & {
        id: string;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        createdAt: Date;
        updatedAt: Date;
        suspendedUntil: Date | null;
        suspensionReason: string | null;
    }>;
    findByUsername(username: string): Promise<{
        books: ({
            _count: {
                likes: number;
                chapters: number;
            };
            category: {
                id: string;
                name: string;
                slug: string;
                color: string | null;
            };
            author: {
                id: string;
                email: string;
                password: string;
                username: string;
                role: import(".prisma/client").$Enums.Role;
                name: string | null;
                avatar: string | null;
                bio: string | null;
                location: string | null;
                website: string | null;
                createdAt: Date;
                updatedAt: Date;
                suspendedUntil: Date | null;
                suspensionReason: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            suspendedUntil: Date | null;
            suspensionReason: string | null;
            title: string;
            description: string | null;
            coverImage: string | null;
            authorId: string;
            categoryId: string | null;
            tags: string[];
            status: import(".prisma/client").$Enums.BookStatus;
            viewCount: number;
        })[];
        _count: {
            books: number;
        };
    } & {
        id: string;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        createdAt: Date;
        updatedAt: Date;
        suspendedUntil: Date | null;
        suspensionReason: string | null;
    }>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<{
        id: string;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        createdAt: Date;
        updatedAt: Date;
        suspendedUntil: Date | null;
        suspensionReason: string | null;
    }>;
    suspendUser(id: string, days: number, reason: string): Promise<{
        id: string;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        createdAt: Date;
        updatedAt: Date;
        suspendedUntil: Date | null;
        suspensionReason: string | null;
    }>;
    unsuspendUser(id: string): Promise<{
        id: string;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        createdAt: Date;
        updatedAt: Date;
        suspendedUntil: Date | null;
        suspensionReason: string | null;
    }>;
}

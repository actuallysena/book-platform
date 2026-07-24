import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookStatus } from '@prisma/client';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(createBookDto: CreateBookDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BookStatus;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        authorId: string;
        categoryId: string | null;
    }>;
    findMyBooks(authorId: string): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
            color: string | null;
        };
        _count: {
            chapters: number;
            comments: number;
            likes: number;
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
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        authorId: string;
        categoryId: string | null;
    })[]>;
    findAll(query?: string, categoryId?: string, sort?: string, tag?: string): Promise<({
        author: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            suspendedUntil: Date | null;
            suspensionReason: string | null;
            name: string | null;
            email: string;
            password: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
            bio: string | null;
            location: string | null;
            website: string | null;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            color: string | null;
        };
        _count: {
            chapters: number;
            comments: number;
            likes: number;
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
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        authorId: string;
        categoryId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        author: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            suspendedUntil: Date | null;
            suspensionReason: string | null;
            name: string | null;
            email: string;
            password: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
            bio: string | null;
            location: string | null;
            website: string | null;
        };
        chapters: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            content: import("@prisma/client/runtime/library").JsonValue;
            order: number;
            published: boolean;
            bookId: string;
        }[];
        _count: {
            chapters: number;
            comments: number;
            likes: number;
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
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        authorId: string;
        categoryId: string | null;
    }>;
    incrementView(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BookStatus;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        authorId: string;
        categoryId: string | null;
    }>;
    toggleLike(id: string, req: any): Promise<{
        liked: boolean;
    }>;
    getLikeStatus(id: string, req: any): Promise<{
        liked: boolean;
    }>;
    update(id: string, updateBookDto: UpdateBookDto, req: any): Promise<{
        id: string;
        title: string;
        description: string | null;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BookStatus;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        authorId: string;
        categoryId: string | null;
    }>;
    updateStatus(id: string, status: BookStatus): Promise<{
        id: string;
        title: string;
        description: string | null;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BookStatus;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        authorId: string;
        categoryId: string | null;
    }>;
    suspend(id: string, body: {
        days: number;
        reason: string;
    }): Promise<{
        id: string;
        title: string;
        description: string | null;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BookStatus;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        authorId: string;
        categoryId: string | null;
    }>;
    unsuspend(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BookStatus;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        authorId: string;
        categoryId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BookStatus;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        suspendedUntil: Date | null;
        suspensionReason: string | null;
        authorId: string;
        categoryId: string | null;
    }>;
}

import { InteractionsService } from './interactions.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class InteractionsController {
    private readonly interactionsService;
    constructor(interactionsService: InteractionsService);
    toggleLike(req: any, bookId: string): Promise<{
        status: string;
    }>;
    addComment(req: any, bookId: string, createCommentDto: CreateCommentDto): Promise<{
        user: {
            id: string;
            createdAt: Date;
            name: string | null;
            email: string;
            password: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
            bio: string | null;
            location: string | null;
            website: string | null;
            updatedAt: Date;
            suspendedUntil: Date | null;
            suspensionReason: string | null;
        };
        book: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            suspendedUntil: Date | null;
            suspensionReason: string | null;
            title: string;
            description: string | null;
            coverImage: string | null;
            status: import(".prisma/client").$Enums.BookStatus;
            viewCount: number;
            authorId: string;
            categoryId: string | null;
            tags: string[];
        };
    } & {
        id: string;
        content: string;
        quote: string | null;
        createdAt: Date;
        blockId: string | null;
        userId: string;
        bookId: string;
        chapterId: string | null;
        parentId: string | null;
    }>;
    getComments(bookId: string): Promise<({
        user: {
            id: string;
            username: string;
            avatar: string;
        };
    } & {
        id: string;
        content: string;
        quote: string | null;
        createdAt: Date;
        blockId: string | null;
        userId: string;
        bookId: string;
        chapterId: string | null;
        parentId: string | null;
    })[]>;
    getChapterComments(chapterId: string): Promise<({
        user: {
            id: string;
            username: string;
            avatar: string;
        };
    } & {
        id: string;
        content: string;
        quote: string | null;
        createdAt: Date;
        blockId: string | null;
        userId: string;
        bookId: string;
        chapterId: string | null;
        parentId: string | null;
    })[]>;
    getGlobalComments(): Promise<({
        user: {
            id: string;
            username: string;
            avatar: string;
        };
        book: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        content: string;
        quote: string | null;
        createdAt: Date;
        blockId: string | null;
        userId: string;
        bookId: string;
        chapterId: string | null;
        parentId: string | null;
    })[]>;
    updateComment(req: any, id: string, body: {
        content: string;
    }): Promise<{
        id: string;
        content: string;
        quote: string | null;
        createdAt: Date;
        blockId: string | null;
        userId: string;
        bookId: string;
        chapterId: string | null;
        parentId: string | null;
    }>;
    deleteComment(req: any, id: string): Promise<{
        id: string;
        content: string;
        quote: string | null;
        createdAt: Date;
        blockId: string | null;
        userId: string;
        bookId: string;
        chapterId: string | null;
        parentId: string | null;
    }>;
}

import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        slug: string;
        color: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        color: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        color: string | null;
    }>;
    findBySlug(slug: string): Promise<{
        books: ({
            category: {
                id: string;
                name: string;
                slug: string;
                color: string | null;
            };
            author: {
                id: string;
                username: string;
                avatar: string;
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
    } & {
        id: string;
        name: string;
        slug: string;
        color: string | null;
    }>;
}

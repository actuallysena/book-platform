import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
export declare class ChaptersController {
    private readonly chaptersService;
    constructor(chaptersService: ChaptersService);
    create(createChapterDto: CreateChapterDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        bookId: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        order: number;
        published: boolean;
    }>;
    findByBook(bookId: string, drafts?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        bookId: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        order: number;
        published: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        bookId: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        order: number;
        published: boolean;
    }>;
    reorder(body: {
        bookId: string;
        chapterIds: string[];
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        bookId: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        order: number;
        published: boolean;
    }[]>;
    update(id: string, updateChapterDto: UpdateChapterDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        bookId: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        order: number;
        published: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        bookId: string;
        content: import("@prisma/client/runtime/library").JsonValue;
        order: number;
        published: boolean;
    }>;
}

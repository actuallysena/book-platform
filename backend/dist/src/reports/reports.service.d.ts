import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createReportDto: CreateReportDto): Promise<{
        id: string;
        reason: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        reporterId: string;
        targetUserId: string | null;
        targetBookId: string | null;
        targetChapterId: string | null;
        targetCommentId: string | null;
    }>;
    updateStatus(id: string, status: 'PENDING' | 'RESOLVED' | 'DISMISSED'): Promise<{
        id: string;
        reason: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        reporterId: string;
        targetUserId: string | null;
        targetBookId: string | null;
        targetChapterId: string | null;
        targetCommentId: string | null;
    }>;
    findAll(status?: string): Promise<({
        reporter: {
            email: string;
            username: string;
        };
        targetUser: {
            id: string;
            username: string;
        };
        targetBook: {
            id: string;
            title: string;
            author: {
                id: string;
                username: string;
            };
        };
        targetChapter: {
            id: string;
            title: string;
            book: {
                id: string;
                title: string;
                author: {
                    id: string;
                    username: string;
                };
            };
        };
        targetComment: {
            id: string;
            content: string;
            user: {
                id: string;
                username: string;
            };
        };
    } & {
        id: string;
        reason: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        reporterId: string;
        targetUserId: string | null;
        targetBookId: string | null;
        targetChapterId: string | null;
        targetCommentId: string | null;
    })[]>;
}

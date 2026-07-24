import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, createReportDto: CreateReportDto) {
        return this.prisma.report.create({
            data: {
                reason: createReportDto.reason,
                reporter: { connect: { id: userId } },
                ...(createReportDto.targetUserId && { targetUser: { connect: { id: createReportDto.targetUserId } } }),
                ...(createReportDto.targetBookId && { targetBook: { connect: { id: createReportDto.targetBookId } } }),
                ...(createReportDto.targetChapterId && { targetChapter: { connect: { id: createReportDto.targetChapterId } } }),
                ...(createReportDto.targetCommentId && { targetComment: { connect: { id: createReportDto.targetCommentId } } }),
            },
        });
    }

    async updateStatus(id: string, status: 'PENDING' | 'RESOLVED' | 'DISMISSED') {
        const reportStatus = status as any; // Cast to bypass enum if needed due to sync issues
        return this.prisma.report.update({
            where: { id },
            data: { status: reportStatus },
        });
    }

    async findAll(status?: string) {
        const where = status ? { status: status as any } : {};
        return this.prisma.report.findMany({
            where,
            include: {
                reporter: { select: { username: true, email: true } },
                targetUser: { select: { id: true, username: true } },
                targetBook: { select: { id: true, title: true, author: { select: { id: true, username: true } } } },
                targetChapter: { select: { id: true, title: true, book: { select: { id: true, title: true, author: { select: { id: true, username: true } } } } } },
                targetComment: { select: { id: true, content: true, user: { select: { id: true, username: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}

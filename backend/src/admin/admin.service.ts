import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    async getStats() {
        const [totalUsers, totalBooks, pendingReports] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.book.count(),
            this.prisma.report.count({ where: { status: 'PENDING' } }),
        ]);

        return {
            totalUsers,
            totalBooks,
            pendingReports,
        };
    }

    async getSuspendedBooks(search?: string) {
        return this.prisma.book.findMany({
            where: {
                status: 'SUSPENDED' as any, // Cast due to sync issue
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { author: { username: { contains: search, mode: 'insensitive' } } },
                    ],
                }),
            },
            include: { author: true },
            orderBy: { suspendedUntil: 'desc' },
        });
    }

    async getSuspendedUsers(search?: string) {
        return this.prisma.user.findMany({
            where: {
                suspendedUntil: { gt: new Date() },
                ...(search && {
                    OR: [
                        { username: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                }),
            },
            orderBy: { suspendedUntil: 'desc' },
        });
    }
}

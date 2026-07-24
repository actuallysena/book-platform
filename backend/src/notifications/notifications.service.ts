import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(recipientId: string, actorId: string, type: string, entityId: string, message: string) {
        if (recipientId === actorId) return; // Don't notify self

        return this.prisma.notification.create({
            data: {
                recipientId,
                actorId,
                type,
                entityId,
                message,
            },
        });
    }

    async findAllForUser(userId: string) {
        return this.prisma.notification.findMany({
            where: { recipientId: userId },
            include: {
                actor: { select: { username: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markAsRead(id: string) {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }

    async getUnreadCount(userId: string) {
        return this.prisma.notification.count({
            where: { recipientId: userId, read: false },
        });
    }

    async getNavigationContext(notificationId: string) {
        const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
        if (!notification) return null;

        if (['REPLY', 'COMMENT'].includes(notification.type)) {
            // entityId is commentId
            const comment = await this.prisma.comment.findUnique({
                where: { id: notification.entityId },
                include: { chapter: true } // Need chapter to know if it's in a chapter or book root
            });
            if (comment) {
                // If it's a chapter comment
                if (comment.chapterId) {
                    return { url: `/read/${comment.bookId}/${comment.chapterId}?highlight=${comment.id}` };
                }
                // If it's a book comment (if supported)
                return { url: `/book/${comment.bookId}?highlight=${comment.id}` };
            }
        }

        if (notification.type === 'LIKE') {
            // entityId is bookId
            return { url: `/book/${notification.entityId}` };
        }

        return { url: '/' };
    }
}

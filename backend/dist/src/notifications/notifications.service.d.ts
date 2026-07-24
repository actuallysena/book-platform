import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(recipientId: string, actorId: string, type: string, entityId: string, message: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        read: boolean;
        entityId: string | null;
        message: string | null;
        actorId: string;
        recipientId: string;
    }>;
    findAllForUser(userId: string): Promise<({
        actor: {
            username: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        type: string;
        read: boolean;
        entityId: string | null;
        message: string | null;
        actorId: string;
        recipientId: string;
    })[]>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        read: boolean;
        entityId: string | null;
        message: string | null;
        actorId: string;
        recipientId: string;
    }>;
    getUnreadCount(userId: string): Promise<number>;
    getNavigationContext(notificationId: string): Promise<{
        url: string;
    }>;
}

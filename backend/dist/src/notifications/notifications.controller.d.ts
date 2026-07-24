import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(req: any): Promise<({
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
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
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
    getNavigationContext(id: string): Promise<{
        url: string;
    }>;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(recipientId, actorId, type, entityId, message) {
        if (recipientId === actorId)
            return;
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
    async findAllForUser(userId) {
        return this.prisma.notification.findMany({
            where: { recipientId: userId },
            include: {
                actor: { select: { username: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: { recipientId: userId, read: false },
        });
    }
    async getNavigationContext(notificationId) {
        const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
        if (!notification)
            return null;
        if (['REPLY', 'COMMENT'].includes(notification.type)) {
            const comment = await this.prisma.comment.findUnique({
                where: { id: notification.entityId },
                include: { chapter: true }
            });
            if (comment) {
                if (comment.chapterId) {
                    return { url: `/read/${comment.bookId}/${comment.chapterId}?highlight=${comment.id}` };
                }
                return { url: `/book/${comment.bookId}?highlight=${comment.id}` };
            }
        }
        if (notification.type === 'LIKE') {
            return { url: `/book/${notification.entityId}` };
        }
        return { url: '/' };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
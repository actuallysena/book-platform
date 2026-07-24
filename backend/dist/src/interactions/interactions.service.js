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
exports.InteractionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let InteractionsService = class InteractionsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async toggleLike(userId, bookId) {
        const existingLike = await this.prisma.like.findFirst({
            where: {
                userId: userId,
                bookId: bookId,
            },
        });
        if (existingLike) {
            await this.prisma.like.delete({
                where: { id: existingLike.id },
            });
            return { status: 'unliked' };
        }
        else {
            await this.prisma.like.create({
                data: {
                    userId: userId,
                    bookId: bookId,
                },
            });
            const book = await this.prisma.book.findUnique({ where: { id: bookId } });
            if (book && book.authorId !== userId) {
                await this.notificationsService.create(book.authorId, userId, 'LIKE', bookId, `Someone liked your book "${book.title}"`);
            }
            return { status: 'liked' };
        }
    }
    async addComment(userId, bookId, createCommentDto) {
        const comment = await this.prisma.comment.create({
            data: {
                content: createCommentDto.content,
                userId: userId,
                bookId: bookId,
                chapterId: createCommentDto.chapterId,
                blockId: createCommentDto.blockId,
                quote: createCommentDto.quote,
                parentId: createCommentDto.parentId,
            },
            include: { book: true, user: true }
        });
        if (createCommentDto.parentId) {
            const parentComment = await this.prisma.comment.findUnique({ where: { id: createCommentDto.parentId } });
            if (parentComment && parentComment.userId !== userId) {
                await this.notificationsService.create(parentComment.userId, userId, 'REPLY', comment.id, `${comment.user.username} replied to your comment`);
            }
        }
        else {
            if (comment.book.authorId !== userId) {
                await this.notificationsService.create(comment.book.authorId, userId, 'COMMENT', comment.id, `${comment.user.username} commented on "${comment.book.title}"`);
            }
        }
        return comment;
    }
    async getBookComments(bookId) {
        return this.prisma.comment.findMany({
            where: { bookId, chapterId: null },
            include: {
                user: { select: { username: true, id: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getChapterComments(chapterId) {
        return this.prisma.comment.findMany({
            where: { chapterId },
            include: { user: { select: { username: true, id: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllComments() {
        return this.prisma.comment.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { username: true, id: true, avatar: true } },
                book: { select: { title: true, id: true } }
            }
        });
    }
    async updateComment(userId, commentId, content) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('You can only edit your own comments');
        }
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { content },
        });
    }
    async deleteComment(commentId, userId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: { book: true },
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const isOwner = comment.userId === userId;
        const isAuthor = comment.book.authorId === userId;
        const isAdminOrMod = user.role === 'ADMIN' || user.role === 'MODERATOR';
        if (!isOwner && !isAuthor && !isAdminOrMod) {
            throw new common_1.ForbiddenException('You do not have permission to delete this comment');
        }
        await this.deleteReplies(commentId);
        return this.prisma.comment.delete({
            where: { id: commentId },
        });
    }
    async deleteReplies(parentId) {
        const replies = await this.prisma.comment.findMany({ where: { parentId } });
        for (const reply of replies) {
            await this.deleteReplies(reply.id);
            await this.prisma.comment.delete({ where: { id: reply.id } });
        }
    }
};
exports.InteractionsService = InteractionsService;
exports.InteractionsService = InteractionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], InteractionsService);
//# sourceMappingURL=interactions.service.js.map
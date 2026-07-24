import { Injectable, Inject, forwardRef, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InteractionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService
    ) { }

    async toggleLike(userId: string, bookId: string) {
        const existingLike = await this.prisma.like.findFirst({
            where: {
                userId: userId,
                bookId: bookId,
            },
        });

        if (existingLike) {
            // Unlike
            await this.prisma.like.delete({
                where: { id: existingLike.id },
            });
            return { status: 'unliked' };
        } else {
            // Like
            await this.prisma.like.create({
                data: {
                    userId: userId,
                    bookId: bookId,
                },
            });

            // Notify Author about Like
            // Use findUnique to get book author if possible, or fetch book
            const book = await this.prisma.book.findUnique({ where: { id: bookId } });
            if (book && book.authorId !== userId) {
                await this.notificationsService.create(
                    book.authorId,
                    userId,
                    'LIKE',
                    bookId,
                    `Someone liked your book "${book.title}"`
                );
            }

            return { status: 'liked' };
        }
    }

    async addComment(userId: string, bookId: string, createCommentDto: CreateCommentDto) {
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

        // Handle Notification
        if (createCommentDto.parentId) {
            const parentComment = await this.prisma.comment.findUnique({ where: { id: createCommentDto.parentId } });
            if (parentComment && parentComment.userId !== userId) {
                await this.notificationsService.create(
                    parentComment.userId,
                    userId,
                    'REPLY',
                    comment.id,
                    `${comment.user.username} replied to your comment`
                );
            }
        } else {
            if (comment.book.authorId !== userId) {
                await this.notificationsService.create(
                    comment.book.authorId,
                    userId,
                    'COMMENT',
                    comment.id, // Use comment.id to allow deep linking
                    `${comment.user.username} commented on "${comment.book.title}"`
                );
            }
        }

        return comment;
    }

    async getBookComments(bookId: string) {
        // Fetch all comments (replies can be filtered client side or we fetch hierarchical)
        // For simplicity now, we fetch ALL comments for the book and let frontend nest them?
        // OR we fetch top-level and include replies.
        // Let's fetch flat list containing parentId, so frontend can build tree.
        return this.prisma.comment.findMany({
            where: { bookId, chapterId: null },
            include: {
                user: { select: { username: true, id: true, avatar: true } },
                // We might want to include replies here if we did recursion, but flat list is fine if we sort by date
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getChapterComments(chapterId: string) {
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

    async updateComment(userId: string, commentId: string, content: string) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comment not found');

        if (comment.userId !== userId) {
            throw new ForbiddenException('You can only edit your own comments');
        }

        return this.prisma.comment.update({
            where: { id: commentId },
            data: { content },
        });
    }

    async deleteComment(commentId: string, userId: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: { book: true },
        });
        if (!comment) throw new NotFoundException('Comment not found');

        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        const isOwner = comment.userId === userId;
        const isAuthor = comment.book.authorId === userId;
        const isAdminOrMod = user.role === 'ADMIN' || user.role === 'MODERATOR';

        if (!isOwner && !isAuthor && !isAdminOrMod) {
            throw new ForbiddenException('You do not have permission to delete this comment');
        }

        // Recursive delete (simulated by finding all descendants first or letting Prisma handle if we had cascade)
        // Since we don't have cascade on self-relation in schema yet, we'll try to delete.
        // If there are foreign key constraints, this will fail.
        // Quick fix: Delete replies first (one level deep usually enough? No, generic tree).
        // Better: Use deleteMany for children.
        // Actually, deleting a parent with children checks foreign keys.
        // Let's try deleting replies where parentId = commentId.
        // Note: This only handles 1 level of nesting. If platform supports deep nesting, we need a recursive helper.
        // Assuming 1-2 levels for now or that we need a better schema fix later.

        await this.deleteReplies(commentId);

        return this.prisma.comment.delete({
            where: { id: commentId },
        });
    }

    private async deleteReplies(parentId: string) {
        const replies = await this.prisma.comment.findMany({ where: { parentId } });
        for (const reply of replies) {
            await this.deleteReplies(reply.id); // Recursively delete children
            await this.prisma.comment.delete({ where: { id: reply.id } });
        }
    }
}

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createBookDto: CreateBookDto) {
        return this.prisma.book.create({
            data: {
                title: createBookDto.title,
                description: createBookDto.description,
                coverImage: createBookDto.coverImage,
                authorId: createBookDto.authorId,
                categoryId: createBookDto.categoryId,
                tags: createBookDto.tags || [],
            },
        });
    }

    async findByAuthor(authorId: string) {
        return this.prisma.book.findMany({
            where: { authorId },
            include: {
                category: true,
                _count: {
                    select: { chapters: true, likes: true, comments: true } // Add counts for chapters and likes
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async findAll(query?: string, categoryId?: string, sort?: string, tag?: string) {
        let orderBy: any = {};
        if (sort === 'newest') {
            orderBy = { updatedAt: 'desc' };
        } else if (sort === 'popular') {
            orderBy = { viewCount: 'desc' };
        } else {
            orderBy = { updatedAt: 'desc' }; // Default to newest
        }

        return this.prisma.book.findMany({
            where: {
                AND: [
                    { status: 'PUBLISHED' }, // Only show published books in public search
                    query ? {
                        OR: [
                            { title: { contains: query, mode: 'insensitive' } },
                            { description: { contains: query, mode: 'insensitive' } },
                            { author: { username: { contains: query, mode: 'insensitive' } } },
                            { author: { name: { contains: query, mode: 'insensitive' } } },
                        ]
                    } : {},
                    categoryId ? { categoryId: categoryId } : {},
                    tag ? { tags: { has: tag } } : {},
                ],
            },
            include: {
                author: true,
                category: true,
                _count: { select: { likes: true, chapters: true, comments: true } }
            },
            orderBy: orderBy,
        });
    }

    async findOne(id: string) {
        return this.prisma.book.findUnique({
            where: { id },
            include: {
                author: true,
                chapters: true,
                _count: { select: { likes: true, comments: true, chapters: true } }
            },
        });
    }

    async incrementView(id: string) {
        return this.prisma.book.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }

    async update(id: string, updateBookDto: UpdateBookDto, userId?: string) {
        if (userId) {
            const book = await this.prisma.book.findUnique({ where: { id } });
            // If book is suspended and user tries to PUBLISH, block it.
            if (book && book.suspendedUntil && book.suspendedUntil > new Date()) {
                if (updateBookDto.status === 'PUBLISHED') {
                    throw new ForbiddenException('This book is currently suspended and cannot be published.');
                }
            }
        }
        return this.prisma.book.update({
            where: { id },
            data: updateBookDto,
        });
    }

    async suspend(id: string, days: number, reason: string) {
        const suspendedUntil = new Date();
        suspendedUntil.setDate(suspendedUntil.getDate() + days);

        return this.prisma.book.update({
            where: { id },
            data: {
                status: 'SUSPENDED', // Requires Enum update in Prisma Client (which is out of sync but will work in runtime if DB is updated)
                suspendedUntil: suspendedUntil,
                suspensionReason: reason
            } as any // Cast as any because Client is out of sync
        });
    }

    async unsuspend(id: string) {
        return this.prisma.book.update({
            where: { id },
            data: {
                status: 'DRAFT', // Revert to Draft
                suspendedUntil: null,
                suspensionReason: null
            }
        });
    }

    async remove(id: string) {
        return this.prisma.book.delete({
            where: { id },
        });
    }

    async toggleLike(bookId: string, userId: string) {
        const existingLike = await this.prisma.like.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId,
                },
            },
        });

        if (existingLike) {
            await this.prisma.like.delete({
                where: { id: existingLike.id },
            });
            return { liked: false };
        } else {
            await this.prisma.like.create({
                data: {
                    userId,
                    bookId,
                },
            });
            return { liked: true };
        }
    }

    async getLikeStatus(bookId: string, userId: string) {
        const like = await this.prisma.like.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId,
                },
            },
        });
        return { liked: !!like };
    }
}

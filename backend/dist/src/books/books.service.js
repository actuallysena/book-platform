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
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BooksService = class BooksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBookDto) {
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
    async findByAuthor(authorId) {
        return this.prisma.book.findMany({
            where: { authorId },
            include: {
                category: true,
                _count: {
                    select: { chapters: true, likes: true, comments: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async findAll(query, categoryId, sort, tag) {
        let orderBy = {};
        if (sort === 'newest') {
            orderBy = { updatedAt: 'desc' };
        }
        else if (sort === 'popular') {
            orderBy = { viewCount: 'desc' };
        }
        else {
            orderBy = { updatedAt: 'desc' };
        }
        return this.prisma.book.findMany({
            where: {
                AND: [
                    { status: 'PUBLISHED' },
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
    async findOne(id) {
        return this.prisma.book.findUnique({
            where: { id },
            include: {
                author: true,
                chapters: true,
                _count: { select: { likes: true, comments: true, chapters: true } }
            },
        });
    }
    async incrementView(id) {
        return this.prisma.book.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }
    async update(id, updateBookDto, userId) {
        if (userId) {
            const book = await this.prisma.book.findUnique({ where: { id } });
            if (book && book.suspendedUntil && book.suspendedUntil > new Date()) {
                if (updateBookDto.status === 'PUBLISHED') {
                    throw new common_1.ForbiddenException('This book is currently suspended and cannot be published.');
                }
            }
        }
        return this.prisma.book.update({
            where: { id },
            data: updateBookDto,
        });
    }
    async suspend(id, days, reason) {
        const suspendedUntil = new Date();
        suspendedUntil.setDate(suspendedUntil.getDate() + days);
        return this.prisma.book.update({
            where: { id },
            data: {
                status: 'SUSPENDED',
                suspendedUntil: suspendedUntil,
                suspensionReason: reason
            }
        });
    }
    async unsuspend(id) {
        return this.prisma.book.update({
            where: { id },
            data: {
                status: 'DRAFT',
                suspendedUntil: null,
                suspensionReason: null
            }
        });
    }
    async remove(id) {
        return this.prisma.book.delete({
            where: { id },
        });
    }
    async toggleLike(bookId, userId) {
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
        }
        else {
            await this.prisma.like.create({
                data: {
                    userId,
                    bookId,
                },
            });
            return { liked: true };
        }
    }
    async getLikeStatus(bookId, userId) {
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
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BooksService);
//# sourceMappingURL=books.service.js.map
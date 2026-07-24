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
exports.ChaptersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChaptersService = class ChaptersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createChapterDto) {
        const lastChapter = await this.prisma.chapter.findFirst({
            where: { bookId: createChapterDto.bookId },
            orderBy: { order: 'desc' },
        });
        const newOrder = lastChapter ? lastChapter.order + 1 : 1;
        return this.prisma.chapter.create({
            data: {
                title: createChapterDto.title,
                content: createChapterDto.content,
                order: newOrder,
                book: { connect: { id: createChapterDto.bookId } },
            },
        });
    }
    async findByBook(bookId, includeDrafts = false) {
        return this.prisma.chapter.findMany({
            where: Object.assign({ bookId }, (includeDrafts ? {} : { published: true })),
            orderBy: { order: 'asc' },
        });
    }
    async update(id, updateChapterDto) {
        const chapter = await this.prisma.chapter.update({
            where: { id },
            data: Object.assign(Object.assign({}, updateChapterDto), { content: updateChapterDto.content }),
        });
        if (updateChapterDto.published === true) {
            await this.prisma.book.updateMany({
                where: {
                    id: chapter.bookId,
                    status: 'DRAFT'
                },
                data: { status: 'PUBLISHED' }
            });
        }
        return chapter;
    }
    async remove(id) {
        return this.prisma.chapter.delete({
            where: { id },
        });
    }
    async findOne(id) {
        return this.prisma.chapter.findUnique({
            where: { id },
        });
    }
    async reorder(bookId, chapterIds) {
        return this.prisma.$transaction(chapterIds.map((id, index) => this.prisma.chapter.update({
            where: { id, bookId },
            data: { order: index + 1 },
        })));
    }
};
exports.ChaptersService = ChaptersService;
exports.ChaptersService = ChaptersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChaptersService);
//# sourceMappingURL=chapters.service.js.map
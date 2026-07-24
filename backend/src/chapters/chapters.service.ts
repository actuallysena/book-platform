import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChaptersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createChapterDto: CreateChapterDto) {
        const lastChapter = await this.prisma.chapter.findFirst({
            where: { bookId: createChapterDto.bookId },
            orderBy: { order: 'desc' },
        });

        const newOrder = lastChapter ? lastChapter.order + 1 : 1;

        return this.prisma.chapter.create({
            data: {
                title: createChapterDto.title,
                content: createChapterDto.content as any, // Cast to any/InputJsonValue
                order: newOrder,
                book: { connect: { id: createChapterDto.bookId } },
            },
        });
    }

    // Default to showing only published, unless getting all for studio
    async findByBook(bookId: string, includeDrafts = false) {
        return this.prisma.chapter.findMany({
            where: {
                bookId,
                ...(includeDrafts ? {} : { published: true })
            },
            orderBy: { order: 'asc' }, // Order by logical order, not creation
        });
    }

    async update(id: string, updateChapterDto: UpdateChapterDto) {
        const chapter = await this.prisma.chapter.update({
            where: { id },
            data: {
                ...updateChapterDto,
                content: updateChapterDto.content as any,
            },
        });

        // Auto-publish book if chapter is published
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

    async remove(id: string) {
        return this.prisma.chapter.delete({
            where: { id },
        });
    }

    async findOne(id: string) {
        return this.prisma.chapter.findUnique({
            where: { id },
        });
    }
    async reorder(bookId: string, chapterIds: string[]) {
        return this.prisma.$transaction(
            chapterIds.map((id, index) =>
                this.prisma.chapter.update({
                    where: { id, bookId },
                    data: { order: index + 1 },
                })
            )
        );
    }
}

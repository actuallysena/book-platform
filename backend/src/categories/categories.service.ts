import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const slug = createCategoryDto.slug || createCategoryDto.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        return this.prisma.category.create({
            data: {
                ...createCategoryDto,
                slug,
            },
        });
    }

    async findAll() {
        return this.prisma.category.findMany();
    }

    async findOne(id: string) {
        return this.prisma.category.findUnique({
            where: { id },
        });
    }

    async findBySlug(slug: string) {
        return this.prisma.category.findUnique({
            where: { slug },
            include: {
                books: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            }
                        },
                        category: true,
                    }
                }
            }
        });
    }
}

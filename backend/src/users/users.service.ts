import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            return await this.prisma.user.create({
                data: {
                    email: createUserDto.email,
                    username: createUserDto.username,
                    password: hashedPassword,
                },
            });
        } catch (error) {
            console.error("Error creating user:", error); // Log the actual error
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Username or email already exists');
                }
            }
            throw new InternalServerErrorException();
        }
    }

    async findAll(search?: string) {
        if (search) {
            return this.prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { name: { contains: search, mode: 'insensitive' } },
                    ],
                },
            });
        }
        return this.prisma.user.findMany();
    }

    async findOne(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                books: {
                    orderBy: { updatedAt: 'desc' },
                    where: { status: 'PUBLISHED' },
                    include: {
                        category: true,
                        author: true,
                        _count: { select: { likes: true, chapters: true } }
                    }
                },
                _count: {
                    select: { books: true }
                }
            }
        });
    }

    async findByUsername(username: string) {
        const user = await this.prisma.user.findUnique({
            where: { username },
            include: {
                books: {
                    orderBy: { updatedAt: 'desc' },
                    where: { status: 'PUBLISHED' }, // Only published books on public profile
                    include: {
                        category: true,
                        author: true,
                        _count: { select: { likes: true, chapters: true } }
                    }
                },
                _count: {
                    select: { books: true }
                }
            }
        });

        if (user) {
            // Correct the count to reflect only the published books fetched
            user._count.books = user.books.length;
        }

        console.log(`Profile fetch for ${username}: found ${user?.books?.length} published books`);
        return user;
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async suspendUser(id: string, days: number, reason: string) {
        // Calculate date
        let suspendedUntil = null;
        if (days > 0) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            suspendedUntil = date;
        } else {
            // Permanent suspension (e.g., set to year 9999)
            suspendedUntil = new Date('9999-12-31');
        }

        return this.prisma.user.update({
            where: { id },
            data: {
                suspendedUntil,
                suspensionReason: reason,
            },
        });
    }

    async unsuspendUser(id: string) {
        return this.prisma.user.update({
            where: { id },
            data: {
                suspendedUntil: null,
                suspensionReason: null,
            },
        });
    }
}

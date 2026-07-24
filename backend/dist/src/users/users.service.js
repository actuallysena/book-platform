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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            return await this.prisma.user.create({
                data: {
                    email: createUserDto.email,
                    username: createUserDto.username,
                    password: hashedPassword,
                },
            });
        }
        catch (error) {
            console.error("Error creating user:", error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Username or email already exists');
                }
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async findAll(search) {
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
    async findOne(id) {
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
    async findByUsername(username) {
        var _a;
        const user = await this.prisma.user.findUnique({
            where: { username },
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
        if (user) {
            user._count.books = user.books.length;
        }
        console.log(`Profile fetch for ${username}: found ${(_a = user === null || user === void 0 ? void 0 : user.books) === null || _a === void 0 ? void 0 : _a.length} published books`);
        return user;
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async suspendUser(id, days, reason) {
        let suspendedUntil = null;
        if (days > 0) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            suspendedUntil = date;
        }
        else {
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
    async unsuspendUser(id) {
        return this.prisma.user.update({
            where: { id },
            data: {
                suspendedUntil: null,
                suspensionReason: null,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map
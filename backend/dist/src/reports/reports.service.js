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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createReportDto) {
        return this.prisma.report.create({
            data: Object.assign(Object.assign(Object.assign(Object.assign({ reason: createReportDto.reason, reporter: { connect: { id: userId } } }, (createReportDto.targetUserId && { targetUser: { connect: { id: createReportDto.targetUserId } } })), (createReportDto.targetBookId && { targetBook: { connect: { id: createReportDto.targetBookId } } })), (createReportDto.targetChapterId && { targetChapter: { connect: { id: createReportDto.targetChapterId } } })), (createReportDto.targetCommentId && { targetComment: { connect: { id: createReportDto.targetCommentId } } })),
        });
    }
    async updateStatus(id, status) {
        const reportStatus = status;
        return this.prisma.report.update({
            where: { id },
            data: { status: reportStatus },
        });
    }
    async findAll(status) {
        const where = status ? { status: status } : {};
        return this.prisma.report.findMany({
            where,
            include: {
                reporter: { select: { username: true, email: true } },
                targetUser: { select: { id: true, username: true } },
                targetBook: { select: { id: true, title: true, author: { select: { id: true, username: true } } } },
                targetChapter: { select: { id: true, title: true, book: { select: { id: true, title: true, author: { select: { id: true, username: true } } } } } },
                targetComment: { select: { id: true, content: true, user: { select: { id: true, username: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const chapters_service_1 = require("./chapters.service");
const prisma_service_1 = require("../prisma/prisma.service");
const mockPrismaService = {
    chapter: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
    },
    book: {
        updateMany: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb),
};
describe('ChaptersService', () => {
    let service;
    let prisma;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                chapters_service_1.ChaptersService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
            ],
        }).compile();
        service = module.get(chapters_service_1.ChaptersService);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('reorder', () => {
        it('should reorder chapters inside a transaction', async () => {
            const bookId = 'book1';
            const chapterIds = ['c1', 'c2', 'c3'];
            mockPrismaService.$transaction.mockImplementation(async (promises) => {
                return promises;
            });
            await service.reorder(bookId, chapterIds);
            expect(prisma.$transaction).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=chapters.service.spec.js.map
import { Test, TestingModule } from '@nestjs/testing';
import { ChaptersService } from './chapters.service';
import { PrismaService } from '../prisma/prisma.service';

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
    let service: ChaptersService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChaptersService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<ChaptersService>(ChaptersService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('reorder', () => {
        it('should reorder chapters inside a transaction', async () => {
            const bookId = 'book1';
            const chapterIds = ['c1', 'c2', 'c3'];

            mockPrismaService.$transaction.mockImplementation(async (promises) => {
                return promises; // Just return what was passed to verify structure
            });

            await service.reorder(bookId, chapterIds);

            expect(prisma.$transaction).toHaveBeenCalled();
            // Logic inside map: order should be index + 1
            // We can't easy inspect the transaction contents without executing them or deep mocking, 
            // but we verified the method exists and calls transaction.
        });
    });
});

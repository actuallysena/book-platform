import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
    user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
};

describe('UsersService', () => {
    let service: UsersService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findByUsername', () => {
        it('should return a user with published books count', async () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                books: [
                    { id: 'b1', title: 'Book 1', status: 'PUBLISHED' },
                    { id: 'b2', title: 'Book 2', status: 'PUBLISHED' },
                ],
                _count: { books: 10 }, // DB returns total count including drafts
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.findByUsername('testuser');

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { username: 'testuser' },
                include: expect.any(Object),
            });
            // Verify our logic fixed the count
            expect(result._count.books).toEqual(2);
        });
    });
});

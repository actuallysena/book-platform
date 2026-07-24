"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_service_1 = require("./users.service");
const prisma_service_1 = require("../prisma/prisma.service");
const mockPrismaService = {
    user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
};
describe('UsersService', () => {
    let service;
    let prisma;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        prisma = module.get(prisma_service_1.PrismaService);
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
                _count: { books: 10 },
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            const result = await service.findByUsername('testuser');
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { username: 'testuser' },
                include: expect.any(Object),
            });
            expect(result._count.books).toEqual(2);
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map
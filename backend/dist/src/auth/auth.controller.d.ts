import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        createdAt: Date;
        updatedAt: Date;
        suspendedUntil: Date | null;
        suspensionReason: string | null;
    }>;
    getProfile(req: any): Promise<{
        books: ({
            _count: {
                likes: number;
                chapters: number;
            };
            category: {
                id: string;
                name: string;
                slug: string;
                color: string | null;
            };
            author: {
                id: string;
                email: string;
                password: string;
                username: string;
                role: import(".prisma/client").$Enums.Role;
                name: string | null;
                avatar: string | null;
                bio: string | null;
                location: string | null;
                website: string | null;
                createdAt: Date;
                updatedAt: Date;
                suspendedUntil: Date | null;
                suspensionReason: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            suspendedUntil: Date | null;
            suspensionReason: string | null;
            title: string;
            description: string | null;
            coverImage: string | null;
            authorId: string;
            categoryId: string | null;
            tags: string[];
            status: import(".prisma/client").$Enums.BookStatus;
            viewCount: number;
        })[];
        _count: {
            books: number;
        };
    } & {
        id: string;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        location: string | null;
        website: string | null;
        createdAt: Date;
        updatedAt: Date;
        suspendedUntil: Date | null;
        suspensionReason: string | null;
    }>;
}

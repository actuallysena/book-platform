import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(identifier: string, pass: string): Promise<any>;
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
}

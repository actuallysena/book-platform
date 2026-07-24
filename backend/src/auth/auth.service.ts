import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(identifier: string, pass: string): Promise<any> {
        // Find user by querying all users and filtering (Not efficient, but simplest for MVP without changing UsersService)
        // Ideally UsersService should have findByEmailOrUsername
        const allUsers = await this.usersService.findAll();

        const isEmail = identifier.includes('@');
        const user = allUsers.find(u => isEmail ? u.email === identifier : u.username === identifier);

        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
            throw new UnauthorizedException({
                message: 'Account Suspended',
                reason: user.suspensionReason,
                until: user.suspendedUntil,
                statusCode: 403
            });
        }

        // Auto-unsuspend if time passed
        if (user.suspendedUntil && new Date(user.suspendedUntil) <= new Date()) {
            // Ideally we should clear the field in DB, but for now we just allow login
            // The field remains as a history record unless cleared by scheduled job or manual action
        }

        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }

    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}

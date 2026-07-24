import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.MODERATOR)
@ApiBearerAuth()
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard stats' })
    getStats() {
        return this.adminService.getStats();
    }

    @Get('suspended-books')
    @ApiOperation({ summary: 'Get suspended books' })
    getSuspendedBooks(@Query('search') search?: string) {
        return this.adminService.getSuspendedBooks(search);
    }

    @Get('suspended-users')
    @ApiOperation({ summary: 'Get suspended users' })
    getSuspendedUsers(@Query('search') search?: string) {
        return this.adminService.getSuspendedUsers(search);
    }
}

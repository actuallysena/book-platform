import { Controller, Get, Post, Body, Param, Query, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role, Prisma } from '@prisma/client';
import { SuspendUserDto } from './dto/suspend-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    findAll(@Query('search') search?: string) {
        return this.usersService.findAll(search);
    }

    @Get('profile/:username')
    @ApiOperation({ summary: 'Get user public profile by username' })
    findByUsername(@Param('username') username: string) {
        return this.usersService.findByUsername(username);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user by id' })
    @ApiResponse({ status: 200, description: 'Return the user.' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a user' })
    update(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
        return this.usersService.update(id, data);
    }

    @Post(':id/suspend')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Suspend a user (Admin/Mod)' })
    suspend(@Param('id') id: string, @Body() suspendUserDto: SuspendUserDto) {
        return this.usersService.suspendUser(id, suspendUserDto.days, suspendUserDto.reason);
    }

    @Post(':id/unsuspend')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Unsuspend a user (Admin/Mod)' })
    unsuspend(@Param('id') id: string) {
        return this.usersService.unsuspendUser(id);
    }
}

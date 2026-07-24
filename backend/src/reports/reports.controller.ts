import { Controller, Get, Post, Body, UseGuards, Request, Query, Patch, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new report' })
    create(@Request() req, @Body() createReportDto: CreateReportDto) {
        return this.reportsService.create(req.user.userId, createReportDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all reports (Admin/Mod)' })
    findAll(@Query('status') status?: string) {
        return this.reportsService.findAll(status);
    }

    @Patch(':id/status')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update report status (Admin/Mod)' })
    updateStatus(@Param('id') id: string, @Body() body: { status: 'PENDING' | 'RESOLVED' | 'DISMISSED' }) {
        return this.reportsService.updateStatus(id, body.status);
    }
}

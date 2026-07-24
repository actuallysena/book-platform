import { Controller, Get, Post, Body, Param, Query, Patch, Req } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role, BookStatus } from '@prisma/client';

@ApiTags('Books')
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new book' })
    @ApiResponse({ status: 201, description: 'The book has been successfully created.' })
    create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    @Get('my-books/:authorId') // Temporary endpoint, normally use JWT
    @ApiOperation({ summary: 'Get books by author ID' })
    findMyBooks(@Param('authorId') authorId: string) {
        return this.booksService.findByAuthor(authorId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all books (with optional search and category filter)' })
    @ApiResponse({ status: 200, description: 'Return all books.' })
    @ApiQuery({ name: 'search', required: false, description: 'Search by title, description or author' })
    @ApiQuery({ name: 'cat', required: false, description: 'Filter by category ID' })
    @ApiQuery({ name: 'sort', required: false, description: 'Sort by: newest, popular (views), likes' })
    @ApiQuery({ name: 'tag', required: false, description: 'Filter by tag' })
    findAll(@Query('search') query?: string, @Query('cat') categoryId?: string, @Query('sort') sort?: string, @Query('tag') tag?: string) {
        return this.booksService.findAll(query, categoryId, sort, tag);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a book by id' })
    @ApiResponse({ status: 200, description: 'Return the book.' })
    findOne(@Param('id') id: string) {
        return this.booksService.findOne(id);
    }

    @Post(':id/view')
    @ApiOperation({ summary: 'Increment book view count' })
    incrementView(@Param('id') id: string) {
        return this.booksService.incrementView(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Post(':id/like')
    @ApiOperation({ summary: 'Toggle like status' })
    toggleLike(@Param('id') id: string, @Req() req: any) {
        return this.booksService.toggleLike(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Get(':id/like-status')
    @ApiOperation({ summary: 'Get like status' })
    getLikeStatus(@Param('id') id: string, @Req() req: any) {
        return this.booksService.getLikeStatus(id, req.user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Patch(':id')
    @ApiOperation({ summary: 'Update a book' })
    async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @Req() req: any) {
        return this.booksService.update(id, updateBookDto, req.user.userId);
    }

    @Patch(':id/status')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update book status (Admin/Mod)' })
    async updateStatus(@Param('id') id: string, @Body('status') status: BookStatus) {
        return this.booksService.update(id, { status });
    }

    @Post(':id/suspend')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Suspend a book (Admin/Mod)' })
    async suspend(@Param('id') id: string, @Body() body: { days: number, reason: string }) {
        return this.booksService.suspend(id, body.days, body.reason);
    }

    @Post(':id/unsuspend')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Unsuspend a book (Admin/Mod)' })
    async unsuspend(@Param('id') id: string) {
        return this.booksService.unsuspend(id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a book (Admin only)' })
    remove(@Param('id') id: string) {
        return this.booksService.remove(id);
    }
}

import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete, Query } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Chapters')
@Controller('chapters')
export class ChaptersController {
    constructor(private readonly chaptersService: ChaptersService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add a new chapter to a book' })
    create(@Body() createChapterDto: CreateChapterDto) {
        return this.chaptersService.create(createChapterDto);
    }

    @Get('book/:bookId')
    @ApiOperation({ summary: 'Get all chapters of a book' })
    @ApiQuery({ name: 'drafts', required: false, type: Boolean })
    findByBook(@Param('bookId') bookId: string, @Query('drafts') drafts?: string) {
        const includeDrafts = drafts === 'true';
        // TODO: In real app, verify user is author if drafts=true
        return this.chaptersService.findByBook(bookId, includeDrafts);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific chapter content' })
    findOne(@Param('id') id: string) {
        return this.chaptersService.findOne(id);
    }



    @Patch('reorder')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Reorder chapters' })
    reorder(@Body() body: { bookId: string; chapterIds: string[] }) {
        return this.chaptersService.reorder(body.bookId, body.chapterIds);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update chapter content, title, or status' })
    update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
        // TODO: Verify ownership (User is author of the book containing this chapter)
        return this.chaptersService.update(id, updateChapterDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a chapter' })
    remove(@Param('id') id: string) {
        // TODO: Verify ownership
        return this.chaptersService.remove(id);
    }
}

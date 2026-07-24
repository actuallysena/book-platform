import { Controller, Post, Get, Body, Param, UseGuards, Request, Delete, Patch } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Interactions')
@Controller('interactions')
export class InteractionsController {
    constructor(private readonly interactionsService: InteractionsService) { }

    @Post('books/:id/like')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Toggle like for a book' })
    toggleLike(@Request() req, @Param('id') bookId: string) {
        return this.interactionsService.toggleLike(req.user.userId, bookId);
    }

    @Post('books/:id/comments')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add a comment to a book' })
    addComment(@Request() req, @Param('id') bookId: string, @Body() createCommentDto: CreateCommentDto) {
        return this.interactionsService.addComment(req.user.userId, bookId, createCommentDto);
    }

    @Get('books/:id/comments')
    @ApiOperation({ summary: 'Get comments for a book (general comments)' })
    getComments(@Param('id') bookId: string) {
        return this.interactionsService.getBookComments(bookId);
    }

    @Get('chapters/:id/comments')
    @ApiOperation({ summary: 'Get comments for a chapter (including inline)' })
    getChapterComments(@Param('id') chapterId: string) {
        return this.interactionsService.getChapterComments(chapterId);
    }

    @Get('global-comments')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get recent comments (Admin/Mod)' })
    getGlobalComments() {
        return this.interactionsService.getAllComments();
    }

    @Patch('comments/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a comment' })
    updateComment(@Request() req, @Param('id') id: string, @Body() body: { content: string }) {
        return this.interactionsService.updateComment(req.user.userId, id, body.content);
    }

    @Delete('comments/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a comment (User/Author/Admin/Mod)' })
    deleteComment(@Request() req, @Param('id') id: string) {
        return this.interactionsService.deleteComment(id, req.user.userId);
    }
}

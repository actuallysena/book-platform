import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ example: 'This is a great book!', description: 'The content of the comment' })
    @IsString()
    @IsNotEmpty()
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: 'uuid-of-chapter', required: false, description: 'Optional chapter ID for inline comments' })
    @IsOptional()
    @IsString()
    chapterId?: string;

    @ApiProperty({ example: 'block-123', required: false, description: 'Optional block ID for paragraph comments' })
    @IsOptional()
    @IsString()
    blockId?: string;

    @ApiProperty({ example: 'Quoted text', required: false })
    @IsOptional()
    @IsString()
    quote?: string;

    @ApiProperty({ example: 'uuid-parent', required: false, description: 'Parent comment ID for replies' })
    @IsOptional()
    @IsString()
    parentId?: string;
}

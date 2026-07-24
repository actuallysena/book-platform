import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
    @ApiProperty({ example: 'The Silent Wind', description: 'The title of the book' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'A mysterious story about...', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'https://example.com/cover.jpg', required: false })
    @IsString()
    @IsOptional()
    coverImage?: string;

    @ApiProperty({ example: 'uuid-of-author', description: 'The ID of the author (User)' })
    @IsUUID()
    @IsNotEmpty()
    authorId: string;

    @ApiProperty({ example: 'uuid-of-category', required: false })
    @IsString()
    @IsOptional()
    categoryId?: string;

    @ApiProperty({ example: ['Fantasy', 'Magic'], required: false })
    @IsOptional()
    tags?: string[];
}

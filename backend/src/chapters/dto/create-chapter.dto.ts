import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChapterDto {
    @ApiProperty({ example: 'Chapter 1: The Beginning', description: 'The title of the chapter' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: { type: 'doc', content: [] }, description: 'The content of the chapter (JSON)' })
    @IsNotEmpty()
    content: any;

    @ApiProperty({ example: 'uuid-of-book', description: 'The ID of the book this chapter belongs to' })
    @IsUUID()
    @IsNotEmpty()
    bookId: string;
}

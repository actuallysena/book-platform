import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
    @ApiProperty({ example: 'Inappropriate content', description: 'Reason for the report' })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @ApiProperty({ example: 'uuid-user', description: 'ID of the user being reported', required: false })
    @IsOptional()
    @IsUUID()
    targetUserId?: string;

    @ApiProperty({ example: 'uuid-book', description: 'ID of the book being reported', required: false })
    @IsOptional()
    @IsUUID()
    targetBookId?: string;

    @ApiProperty({ example: 'uuid-chapter', description: 'ID of the chapter being reported', required: false })
    @IsOptional()
    @IsUUID()
    targetChapterId?: string;

    @ApiProperty({ example: 'uuid-comment', description: 'ID of the comment being reported', required: false })
    @IsOptional()
    @IsUUID()
    targetCommentId?: string;
}

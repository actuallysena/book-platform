import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateChapterDto {
    @ApiPropertyOptional({ example: 'Chapter Title' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    content?: any;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    @IsOptional()
    published?: boolean;
}

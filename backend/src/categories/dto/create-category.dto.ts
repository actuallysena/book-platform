import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Fantasy', description: 'The name of the category' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'fantasy', description: 'URL friendly name', required: false })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({ example: 'bg-purple-500/10', description: 'Tailwind color class', required: false })
    @IsString()
    @IsOptional()
    color?: string;
}

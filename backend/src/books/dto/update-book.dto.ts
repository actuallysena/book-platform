import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { BookStatus } from '@prisma/client';

export { BookStatus };

export class UpdateBookDto extends PartialType(CreateBookDto) {
    @ApiPropertyOptional({ enum: BookStatus })
    @IsEnum(BookStatus)
    @IsOptional()
    status?: BookStatus;
}

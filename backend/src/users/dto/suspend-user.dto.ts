import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuspendUserDto {
    @ApiProperty({ example: 7, description: 'Number of days to suspend (0 for permanent)', required: true })
    @IsNumber()
    @Min(0)
    days: number;

    @ApiProperty({ example: 'Violated community guidelines', description: 'Reason for suspension' })
    @IsString()
    @IsNotEmpty()
    reason: string;
}

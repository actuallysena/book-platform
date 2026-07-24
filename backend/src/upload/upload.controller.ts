import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { extname, join } from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadController {
    @Post()
    @ApiOperation({ summary: 'Upload a file (e.g. book cover)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file')) // Memory storage by default
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('File is required');

        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        const filename = `${randomName}.webp`; // Use WebP for compression
        const filePath = join(uploadDir, filename);

        // Compress and resize image
        await sharp(file.buffer)
            .resize(400) // Resize width to 400px, auto height
            .webp({ quality: 40 }) // Convert to WebP with 40% quality (extreme compression)
            .toFile(filePath);

        return {
            url: `/uploads/${filename}`,
        };
    }

    @Get(':filename')
    @ApiOperation({ summary: 'Serve a static file' })
    serveFile(@Param('filename') filename, @Res() res) {
        res.sendFile(filename, { root: './uploads' });
    }
}


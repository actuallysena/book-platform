import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
            // No dest option means memory storage
        }),
    ],
    controllers: [UploadController],
})
export class UploadModule { }

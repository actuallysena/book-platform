import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { InteractionsModule } from './interactions/interactions.module';
import { CategoriesModule } from './categories/categories.module';
import { ChaptersModule } from './chapters/chapters.module';

import { NotificationsModule } from './notifications/notifications.module';

import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [PrismaModule, BooksModule, UsersModule, AuthModule, UploadModule, InteractionsModule, CategoriesModule, ChaptersModule, NotificationsModule, ReportsModule, AdminModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

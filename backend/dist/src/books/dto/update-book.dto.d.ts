import { CreateBookDto } from './create-book.dto';
import { BookStatus } from '@prisma/client';
export { BookStatus };
declare const UpdateBookDto_base: import("@nestjs/common").Type<Partial<CreateBookDto>>;
export declare class UpdateBookDto extends UpdateBookDto_base {
    status?: BookStatus;
}

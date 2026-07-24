"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChapterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateChapterDto {
}
exports.CreateChapterDto = CreateChapterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Chapter 1: The Beginning', description: 'The title of the chapter' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChapterDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { type: 'doc', content: [] }, description: 'The content of the chapter (JSON)' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateChapterDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-book', description: 'The ID of the book this chapter belongs to' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChapterDto.prototype, "bookId", void 0);
//# sourceMappingURL=create-chapter.dto.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsController = void 0;
const common_1 = require("@nestjs/common");
const interactions_service_1 = require("./interactions.service");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const client_1 = require("@prisma/client");
let InteractionsController = class InteractionsController {
    constructor(interactionsService) {
        this.interactionsService = interactionsService;
    }
    toggleLike(req, bookId) {
        return this.interactionsService.toggleLike(req.user.userId, bookId);
    }
    addComment(req, bookId, createCommentDto) {
        return this.interactionsService.addComment(req.user.userId, bookId, createCommentDto);
    }
    getComments(bookId) {
        return this.interactionsService.getBookComments(bookId);
    }
    getChapterComments(chapterId) {
        return this.interactionsService.getChapterComments(chapterId);
    }
    getGlobalComments() {
        return this.interactionsService.getAllComments();
    }
    updateComment(req, id, body) {
        return this.interactionsService.updateComment(req.user.userId, id, body.content);
    }
    deleteComment(req, id) {
        return this.interactionsService.deleteComment(id, req.user.userId);
    }
};
exports.InteractionsController = InteractionsController;
__decorate([
    (0, common_1.Post)('books/:id/like'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle like for a book' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Post)('books/:id/comments'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment to a book' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)('books/:id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comments for a book (general comments)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Get)('chapters/:id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comments for a chapter (including inline)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "getChapterComments", null);
__decorate([
    (0, common_1.Get)('global-comments'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MODERATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent comments (Admin/Mod)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "getGlobalComments", null);
__decorate([
    (0, common_1.Patch)('comments/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a comment' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "updateComment", null);
__decorate([
    (0, common_1.Delete)('comments/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a comment (User/Author/Admin/Mod)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "deleteComment", null);
exports.InteractionsController = InteractionsController = __decorate([
    (0, swagger_1.ApiTags)('Interactions'),
    (0, common_1.Controller)('interactions'),
    __metadata("design:paramtypes", [interactions_service_1.InteractionsService])
], InteractionsController);
//# sourceMappingURL=interactions.controller.js.map
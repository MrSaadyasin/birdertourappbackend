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
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const has_roles_decorator_1 = require("../../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../../common/enum/role.enum");
const passport_1 = require("@nestjs/passport");
const blog_service_1 = require("./blog.service");
const blog_dto_1 = require("../../../dto/blog.dto");
const files_interceptor_1 = require("../../../common/interceptors/files.interceptor");
let BlogController = class BlogController {
    constructor(service) {
        this.service = service;
    }
    async BlogList(res) {
        const blogs = await this.service.BlogList();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Blogs fetch successfully',
            blogs
        });
    }
    async BlogCreate(body, request, res) {
        const blog = await this.service.BlogCreate(body, request);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Blog created successfully',
            blog
        });
    }
    async BlogDelete(id, res) {
        await this.service.BlogDelete(id);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Blog deleted successfully'
        });
    }
    async BlogEdit(slug, res) {
        const blog = await this.service.BlogEdit(slug);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Blog fetch successfully',
            blog: blog
        });
    }
    async BlogUpdate(slug, request, res) {
        const blog = await this.service.BlogUpdate(slug, request);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Blog updated successfully',
            blog: blog
        });
    }
    async BlogDetail(res, slug) {
        const blog = await this.service.BlogDetail(slug);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Blog fetch successfully',
            blog
        });
    }
};
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "BlogList", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseInterceptors)(files_interceptor_1.FilesInterceptor),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blog_dto_1.BlogDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "BlogCreate", null);
__decorate([
    (0, common_1.Delete)('delete'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "BlogDelete", null);
__decorate([
    (0, common_1.Put)('edit'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Query)('slug')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "BlogEdit", null);
__decorate([
    (0, common_1.Patch)('update'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    (0, common_1.UseInterceptors)(files_interceptor_1.FilesInterceptor),
    __param(0, (0, common_1.Query)('slug')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "BlogUpdate", null);
__decorate([
    (0, common_1.Get)('detail'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "BlogDetail", null);
BlogController = __decorate([
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
exports.BlogController = BlogController;
//# sourceMappingURL=blog.controller.js.map
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
exports.TermsConditionController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../common/guards/roles.guard");
const has_roles_decorator_1 = require("../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../common/enum/role.enum");
const passport_1 = require("@nestjs/passport");
const termsCondition_dto_1 = require("../../dto/termsCondition.dto");
const termsCondition_service_1 = require("./termsCondition.service");
let TermsConditionController = class TermsConditionController {
    constructor(service) {
        this.service = service;
    }
    async get(res) {
        const termsCondition = await this.service.get();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Terms Condition added successfully',
            termsCondition: termsCondition
        });
    }
    async createOrUpdate(termsConditionDto, res) {
        await this.service.createOrUpdate(termsConditionDto);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Terms Condition updated successfully'
        });
    }
    async topVendors(res) {
        const topVendors = await this.service.topVendors();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Top Vendors fetch successfully',
            topVendors: topVendors
        });
    }
};
__decorate([
    (0, common_1.Get)('terms-condition'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TermsConditionController.prototype, "get", null);
__decorate([
    (0, common_1.Post)('terms-condition/update'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [termsCondition_dto_1.TermsConditionDTO, Object]),
    __metadata("design:returntype", Promise)
], TermsConditionController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.Get)('top-vendors'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TermsConditionController.prototype, "topVendors", null);
TermsConditionController = __decorate([
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [termsCondition_service_1.TermsConditionService])
], TermsConditionController);
exports.TermsConditionController = TermsConditionController;
//# sourceMappingURL=termsCondition.controller.js.map
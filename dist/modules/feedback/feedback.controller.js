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
exports.FeedBackController = void 0;
const common_1 = require("@nestjs/common");
const feedback_dto_1 = require("../../dto/feedback.dto");
const roles_guard_1 = require("../../common/guards/roles.guard");
const has_roles_decorator_1 = require("../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../common/enum/role.enum");
const passport_1 = require("@nestjs/passport");
const feedback_service_1 = require("./feedback.service");
let FeedBackController = class FeedBackController {
    constructor(service) {
        this.service = service;
    }
    async GetAll(res) {
        const tours = await this.service.getAll();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Feedback get successfull',
            tours: tours
        });
    }
    async Add(req, res, request) {
        await this.service.add(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Feedback submitted successfully'
        });
    }
    async PendingFeedBack(res, request) {
        const pendingFeedbacks = await this.service.pendingFeedBack(request);
        return res.status(common_1.HttpStatus.OK).send({
            message: '',
            pendingFeedbacks: pendingFeedbacks
        });
    }
};
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeedBackController.prototype, "GetAll", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [feedback_dto_1.FeedBackDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], FeedBackController.prototype, "Add", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FeedBackController.prototype, "PendingFeedBack", null);
FeedBackController = __decorate([
    (0, common_1.Controller)('feedback'),
    __metadata("design:paramtypes", [feedback_service_1.FeedBackService])
], FeedBackController);
exports.FeedBackController = FeedBackController;
//# sourceMappingURL=feedback.controller.js.map
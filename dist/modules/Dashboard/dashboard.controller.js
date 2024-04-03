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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../common/guards/roles.guard");
const has_roles_decorator_1 = require("../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../common/enum/role.enum");
const passport_1 = require("@nestjs/passport");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    constructor(service) {
        this.service = service;
    }
    async dashboardStats(res) {
        const stats = await this.service.dashboardStats();
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Dashboard stats fetch successfully',
            stats: stats
        });
    }
    async getAllMailGroup(body, res) {
        const mailGroup = await this.service.getAllMailGroup(body);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Mail-group get successfully',
            mailGroup: mailGroup
        });
    }
};
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "dashboardStats", null);
__decorate([
    (0, common_1.Post)('mail/groups'),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.Admin),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAllMailGroup", null);
DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map
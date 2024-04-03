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
exports.WishListController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../../common/guards/roles.guard");
const has_roles_decorator_1 = require("../../common/custom-decorators/has-roles.decorator");
const role_enum_1 = require("../../common/enum/role.enum");
const passport_1 = require("@nestjs/passport");
const wishlist_service_1 = require("./wishlist.service");
const wishlist_dto_1 = require("../../dto/wishlist.dto");
let WishListController = class WishListController {
    constructor(service) {
        this.service = service;
    }
    async getAll(req, res) {
        const wishlists = await this.service.getAll(req);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Wishlist fetch successfully',
            wishlists: wishlists
        });
    }
    async tour(req, res, request) {
        const wishlist = await this.service.tour(req, request);
        return res.status(common_1.HttpStatus.OK).send({
            message: wishlist ? 'Tour has been added in wishlist' : 'Tour removed from wishlist',
        });
    }
};
__decorate([
    (0, common_1.Get)('all'),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.User),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)('tour'),
    (0, has_roles_decorator_1.HasRoles)(role_enum_1.Role.User),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wishlist_dto_1.WishListDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], WishListController.prototype, "tour", null);
WishListController = __decorate([
    (0, common_1.Controller)('wishlist'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [wishlist_service_1.WishListService])
], WishListController);
exports.WishListController = WishListController;
//# sourceMappingURL=wishlist.controller.js.map
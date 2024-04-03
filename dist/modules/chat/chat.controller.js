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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../common/guards/roles.guard");
let ChatController = class ChatController {
    constructor(service) {
        this.service = service;
    }
    async sendMessage(body, res) {
        const chat = await this.service.chat(body);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'chat',
            chat: chat
        });
    }
    async chatProfileList(res, request) {
        const chatProfileList = await this.service.chatProfileList(request);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Chat profile list fetch successfully',
            profileList: chatProfileList
        });
    }
    async chatMessageList(body, res, request) {
        const chatMessageList = await this.service.chatMessageList(body, request);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Chat fetch successfully',
            chatMessageList: chatMessageList
        });
    }
    async deleteChat(body, res) {
        await this.service.deleteChat(body);
        return res.status(common_1.HttpStatus.OK).send({
            message: 'Chat deleted successfully',
        });
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "chatProfileList", null);
__decorate([
    (0, common_1.Post)('message'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "chatMessageList", null);
__decorate([
    (0, common_1.Post)('delete'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteChat", null);
ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map
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
exports.FeedBackModule = void 0;
const common_1 = require("@nestjs/common");
const feedback_controller_1 = require("./feedback.controller");
const feedback_service_1 = require("./feedback.service");
const database_module_1 = require("../../common/database/database.module");
let FeedBackModule = class FeedBackModule {
    constructor() {
    }
};
FeedBackModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
        ],
        controllers: [feedback_controller_1.FeedBackController],
        providers: [feedback_service_1.FeedBackService],
        exports: [],
    }),
    __metadata("design:paramtypes", [])
], FeedBackModule);
exports.FeedBackModule = FeedBackModule;
//# sourceMappingURL=feedback.module.js.map
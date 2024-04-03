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
exports.TermsConditionModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../common/database/database.module");
const Email_service_1 = require("../../Utils/Email.service");
const termsCondition_controller_1 = require("./termsCondition.controller");
const termsCondition_service_1 = require("./termsCondition.service");
let TermsConditionModule = class TermsConditionModule {
    constructor() {
    }
};
TermsConditionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
        ],
        controllers: [termsCondition_controller_1.TermsConditionController],
        providers: [termsCondition_service_1.TermsConditionService, Email_service_1.EmailService],
        exports: [],
    }),
    __metadata("design:paramtypes", [])
], TermsConditionModule);
exports.TermsConditionModule = TermsConditionModule;
//# sourceMappingURL=termsCondition.module.js.map
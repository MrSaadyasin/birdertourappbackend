"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesInterceptor = void 0;
const common_1 = require("@nestjs/common");
const multer = require("multer");
let FilesInterceptor = class FilesInterceptor {
    async intercept(context, next) {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest();
        await new Promise((resolve, reject) => multer().fields([{ name: 'video', maxCount: 1 },
            { name: 'images', maxCount: 10 },
            { name: 'profile_image', maxCount: 1 },
            { name: 'banner_image', maxCount: 1 },
            { name: 'documents', maxCount: 20 }])(req, ctx.getResponse(), (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        }));
        return next.handle();
    }
};
FilesInterceptor = __decorate([
    (0, common_1.Injectable)()
], FilesInterceptor);
exports.FilesInterceptor = FilesInterceptor;
//# sourceMappingURL=files.interceptor.js.map
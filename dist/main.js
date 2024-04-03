"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const root_module_1 = require("./root.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const Port = process.env.PORT;
    const app = await core_1.NestFactory.create(root_module_1.RootModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.use(cookieParser());
    await app.listen(Port);
    console.log(`Server is running on the port ${Port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
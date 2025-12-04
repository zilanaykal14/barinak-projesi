"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const irk_module_1 = require("./irk/irk.module");
const hayvan_module_1 = require("./hayvan/hayvan.module");
const asi_module_1 = require("./asi/asi.module");
const cip_module_1 = require("./cip/cip.module");
const bildirim_module_1 = require("./bildirim/bildirim.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: process.env.DATABASE_URL ? 'postgres' : 'mysql',
                url: process.env.DATABASE_URL,
                host: process.env.DATABASE_URL ? undefined : '127.0.0.1',
                port: process.env.DATABASE_URL ? undefined : 3306,
                username: process.env.DATABASE_URL ? undefined : 'root',
                password: process.env.DATABASE_URL ? undefined : '',
                database: process.env.DATABASE_URL ? undefined : 'shelter_db',
                autoLoadEntities: true,
                synchronize: true,
                ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
            }),
            users_module_1.UsersModule,
            irk_module_1.IrkModule,
            hayvan_module_1.HayvanModule,
            asi_module_1.AsiModule,
            cip_module_1.CipModule,
            bildirim_module_1.BildirimModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
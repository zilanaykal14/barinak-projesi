"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HayvanModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hayvan_service_1 = require("./hayvan.service");
const hayvan_controller_1 = require("./hayvan.controller");
const hayvan_entity_1 = require("./entities/hayvan.entity");
let HayvanModule = class HayvanModule {
};
exports.HayvanModule = HayvanModule;
exports.HayvanModule = HayvanModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([hayvan_entity_1.Hayvan])],
        controllers: [hayvan_controller_1.HayvanController],
        providers: [hayvan_service_1.HayvanService],
    })
], HayvanModule);
//# sourceMappingURL=hayvan.module.js.map
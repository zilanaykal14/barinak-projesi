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
exports.CipController = void 0;
const common_1 = require("@nestjs/common");
const cip_service_1 = require("./cip.service");
const create_cip_dto_1 = require("./dto/create-cip.dto");
const update_cip_dto_1 = require("./dto/update-cip.dto");
let CipController = class CipController {
    cipService;
    constructor(cipService) {
        this.cipService = cipService;
    }
    create(createCipDto) {
        return this.cipService.create(createCipDto);
    }
    findAll() {
        return this.cipService.findAll();
    }
    findOne(id) {
        return this.cipService.findOne(+id);
    }
    update(id, updateCipDto) {
        return this.cipService.update(+id, updateCipDto);
    }
    remove(id) {
        return this.cipService.remove(+id);
    }
};
exports.CipController = CipController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cip_dto_1.CreateCipDto]),
    __metadata("design:returntype", void 0)
], CipController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CipController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CipController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cip_dto_1.UpdateCipDto]),
    __metadata("design:returntype", void 0)
], CipController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CipController.prototype, "remove", null);
exports.CipController = CipController = __decorate([
    (0, common_1.Controller)('cip'),
    __metadata("design:paramtypes", [cip_service_1.CipService])
], CipController);
//# sourceMappingURL=cip.controller.js.map
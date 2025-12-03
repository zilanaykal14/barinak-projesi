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
exports.HayvanController = void 0;
const common_1 = require("@nestjs/common");
const hayvan_service_1 = require("./hayvan.service");
const create_hayvan_dto_1 = require("./dto/create-hayvan.dto");
const update_hayvan_dto_1 = require("./dto/update-hayvan.dto");
let HayvanController = class HayvanController {
    hayvanService;
    constructor(hayvanService) {
        this.hayvanService = hayvanService;
    }
    create(createHayvanDto) {
        return this.hayvanService.create(createHayvanDto);
    }
    findAll() {
        return this.hayvanService.findAll();
    }
    findOne(id) {
        return this.hayvanService.findOne(+id);
    }
    update(id, updateHayvanDto) {
        return this.hayvanService.update(+id, updateHayvanDto);
    }
    remove(id) {
        return this.hayvanService.remove(+id);
    }
};
exports.HayvanController = HayvanController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hayvan_dto_1.CreateHayvanDto]),
    __metadata("design:returntype", void 0)
], HayvanController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HayvanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HayvanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hayvan_dto_1.UpdateHayvanDto]),
    __metadata("design:returntype", void 0)
], HayvanController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HayvanController.prototype, "remove", null);
exports.HayvanController = HayvanController = __decorate([
    (0, common_1.Controller)('hayvan'),
    __metadata("design:paramtypes", [hayvan_service_1.HayvanService])
], HayvanController);
//# sourceMappingURL=hayvan.controller.js.map
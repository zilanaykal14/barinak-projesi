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
exports.BildirimController = void 0;
const common_1 = require("@nestjs/common");
const bildirim_service_1 = require("./bildirim.service");
const create_bildirim_dto_1 = require("./dto/create-bildirim.dto");
const update_bildirim_dto_1 = require("./dto/update-bildirim.dto");
let BildirimController = class BildirimController {
    bildirimService;
    constructor(bildirimService) {
        this.bildirimService = bildirimService;
    }
    create(createBildirimDto) {
        return this.bildirimService.create(createBildirimDto);
    }
    findAll() {
        return this.bildirimService.findAll();
    }
    findOne(id) {
        return this.bildirimService.findOne(+id);
    }
    update(id, updateBildirimDto) {
        return this.bildirimService.update(+id, updateBildirimDto);
    }
    remove(id) {
        return this.bildirimService.remove(+id);
    }
};
exports.BildirimController = BildirimController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bildirim_dto_1.CreateBildirimDto]),
    __metadata("design:returntype", void 0)
], BildirimController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BildirimController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BildirimController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bildirim_dto_1.UpdateBildirimDto]),
    __metadata("design:returntype", void 0)
], BildirimController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BildirimController.prototype, "remove", null);
exports.BildirimController = BildirimController = __decorate([
    (0, common_1.Controller)('bildirim'),
    __metadata("design:paramtypes", [bildirim_service_1.BildirimService])
], BildirimController);
//# sourceMappingURL=bildirim.controller.js.map
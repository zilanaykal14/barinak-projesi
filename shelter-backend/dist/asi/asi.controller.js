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
exports.AsiController = void 0;
const common_1 = require("@nestjs/common");
const asi_service_1 = require("./asi.service");
const create_asi_dto_1 = require("./dto/create-asi.dto");
const update_asi_dto_1 = require("./dto/update-asi.dto");
let AsiController = class AsiController {
    asiService;
    constructor(asiService) {
        this.asiService = asiService;
    }
    create(createAsiDto) {
        return this.asiService.create(createAsiDto);
    }
    findAll() {
        return this.asiService.findAll();
    }
    findOne(id) {
        return this.asiService.findOne(+id);
    }
    update(id, updateAsiDto) {
        return this.asiService.update(+id, updateAsiDto);
    }
    remove(id) {
        return this.asiService.remove(+id);
    }
};
exports.AsiController = AsiController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asi_dto_1.CreateAsiDto]),
    __metadata("design:returntype", void 0)
], AsiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AsiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AsiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_asi_dto_1.UpdateAsiDto]),
    __metadata("design:returntype", void 0)
], AsiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AsiController.prototype, "remove", null);
exports.AsiController = AsiController = __decorate([
    (0, common_1.Controller)('asi'),
    __metadata("design:paramtypes", [asi_service_1.AsiService])
], AsiController);
//# sourceMappingURL=asi.controller.js.map
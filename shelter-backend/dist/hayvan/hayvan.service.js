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
exports.HayvanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hayvan_entity_1 = require("./entities/hayvan.entity");
let HayvanService = class HayvanService {
    hayvanRepository;
    constructor(hayvanRepository) {
        this.hayvanRepository = hayvanRepository;
    }
    create(createHayvanDto) {
        return this.hayvanRepository.save(createHayvanDto);
    }
    findAll() {
        return this.hayvanRepository.find({
            relations: ['irk', 'asilar', 'cip'],
        });
    }
    findOne(id) {
        return this.hayvanRepository.findOne({
            where: { id },
            relations: ['irk', 'asilar', 'cip'],
        });
    }
    async update(id, updateHayvanDto) {
        const hayvan = await this.hayvanRepository.preload({
            id: +id,
            ...updateHayvanDto,
        });
        if (!hayvan) {
            throw new common_1.NotFoundException(`Hayvan #${id} bulunamadı`);
        }
        return this.hayvanRepository.save(hayvan);
    }
    remove(id) {
        return this.hayvanRepository.delete(id);
    }
};
exports.HayvanService = HayvanService;
exports.HayvanService = HayvanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hayvan_entity_1.Hayvan)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HayvanService);
//# sourceMappingURL=hayvan.service.js.map
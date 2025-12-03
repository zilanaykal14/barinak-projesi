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
exports.Hayvan = void 0;
const typeorm_1 = require("typeorm");
const irk_entity_1 = require("../../irk/entities/irk.entity");
const asi_entity_1 = require("../../asi/entities/asi.entity");
const cip_entity_1 = require("../../cip/entities/cip.entity");
let Hayvan = class Hayvan {
    id;
    ad;
    yas;
    cinsiyet;
    durum;
    resimUrl;
    irk;
    asilar;
    cip;
};
exports.Hayvan = Hayvan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Hayvan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hayvan.prototype, "ad", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Hayvan.prototype, "yas", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hayvan.prototype, "cinsiyet", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hayvan.prototype, "durum", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hayvan.prototype, "resimUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => irk_entity_1.Irk, (irk) => irk.hayvanlar, { onDelete: 'SET NULL' }),
    __metadata("design:type", irk_entity_1.Irk)
], Hayvan.prototype, "irk", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => asi_entity_1.Asi),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Hayvan.prototype, "asilar", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => cip_entity_1.Cip, { cascade: true, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", cip_entity_1.Cip)
], Hayvan.prototype, "cip", void 0);
exports.Hayvan = Hayvan = __decorate([
    (0, typeorm_1.Entity)()
], Hayvan);
//# sourceMappingURL=hayvan.entity.js.map
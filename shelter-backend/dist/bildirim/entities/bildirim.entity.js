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
exports.Bildirim = void 0;
const typeorm_1 = require("typeorm");
let Bildirim = class Bildirim {
    id;
    tip;
    mesaj;
    gonderenAd;
    hayvanId;
    durum;
};
exports.Bildirim = Bildirim;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Bildirim.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bildirim.prototype, "tip", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bildirim.prototype, "mesaj", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bildirim.prototype, "gonderenAd", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Bildirim.prototype, "hayvanId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Bekliyor' }),
    __metadata("design:type", String)
], Bildirim.prototype, "durum", void 0);
exports.Bildirim = Bildirim = __decorate([
    (0, typeorm_1.Entity)()
], Bildirim);
//# sourceMappingURL=bildirim.entity.js.map
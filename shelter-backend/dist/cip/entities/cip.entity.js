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
exports.Cip = void 0;
const typeorm_1 = require("typeorm");
const hayvan_entity_1 = require("../../hayvan/entities/hayvan.entity");
let Cip = class Cip {
    id;
    numara;
    hayvan;
};
exports.Cip = Cip;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Cip.prototype, "numara", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => hayvan_entity_1.Hayvan, (hayvan) => hayvan.cip),
    __metadata("design:type", hayvan_entity_1.Hayvan)
], Cip.prototype, "hayvan", void 0);
exports.Cip = Cip = __decorate([
    (0, typeorm_1.Entity)()
], Cip);
//# sourceMappingURL=cip.entity.js.map
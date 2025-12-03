"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHayvanDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_hayvan_dto_1 = require("./create-hayvan.dto");
class UpdateHayvanDto extends (0, mapped_types_1.PartialType)(create_hayvan_dto_1.CreateHayvanDto) {
}
exports.UpdateHayvanDto = UpdateHayvanDto;
//# sourceMappingURL=update-hayvan.dto.js.map
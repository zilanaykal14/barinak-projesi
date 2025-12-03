"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIrkDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_irk_dto_1 = require("./create-irk.dto");
class UpdateIrkDto extends (0, mapped_types_1.PartialType)(create_irk_dto_1.CreateIrkDto) {
}
exports.UpdateIrkDto = UpdateIrkDto;
//# sourceMappingURL=update-irk.dto.js.map
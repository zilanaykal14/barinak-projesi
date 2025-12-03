"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCipDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cip_dto_1 = require("./create-cip.dto");
class UpdateCipDto extends (0, mapped_types_1.PartialType)(create_cip_dto_1.CreateCipDto) {
}
exports.UpdateCipDto = UpdateCipDto;
//# sourceMappingURL=update-cip.dto.js.map
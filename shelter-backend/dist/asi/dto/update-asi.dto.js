"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAsiDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_asi_dto_1 = require("./create-asi.dto");
class UpdateAsiDto extends (0, mapped_types_1.PartialType)(create_asi_dto_1.CreateAsiDto) {
}
exports.UpdateAsiDto = UpdateAsiDto;
//# sourceMappingURL=update-asi.dto.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBildirimDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_bildirim_dto_1 = require("./create-bildirim.dto");
class UpdateBildirimDto extends (0, mapped_types_1.PartialType)(create_bildirim_dto_1.CreateBildirimDto) {
}
exports.UpdateBildirimDto = UpdateBildirimDto;
//# sourceMappingURL=update-bildirim.dto.js.map
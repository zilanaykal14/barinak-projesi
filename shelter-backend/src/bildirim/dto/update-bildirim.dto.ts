import { PartialType } from '@nestjs/mapped-types';
import { CreateBildirimDto } from './create-bildirim.dto';

export class UpdateBildirimDto extends PartialType(CreateBildirimDto) {}

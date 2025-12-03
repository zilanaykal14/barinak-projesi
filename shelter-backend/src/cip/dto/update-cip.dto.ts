import { PartialType } from '@nestjs/mapped-types';
import { CreateCipDto } from './create-cip.dto';

export class UpdateCipDto extends PartialType(CreateCipDto) {}

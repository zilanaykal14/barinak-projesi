import { PartialType } from '@nestjs/mapped-types';
import { CreateHayvanDto } from './create-hayvan.dto';

export class UpdateHayvanDto extends PartialType(CreateHayvanDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateIrkDto } from './create-irk.dto';

export class UpdateIrkDto extends PartialType(CreateIrkDto) {}

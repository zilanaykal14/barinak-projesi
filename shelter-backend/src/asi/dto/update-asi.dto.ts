import { PartialType } from '@nestjs/mapped-types';
import { CreateAsiDto } from './create-asi.dto';

export class UpdateAsiDto extends PartialType(CreateAsiDto) {}
